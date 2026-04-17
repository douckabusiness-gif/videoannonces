import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Helper function to check admin access
async function checkAdminAccess() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { error: 'Non authentifié', status: 401 };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
        return { error: 'Accès refusé', status: 403 };
    }

    return { adminId: session.user.id };
}

// Helper function to log admin actions
async function logAdminAction(adminId: string, action: string, targetType?: string, targetId?: string, details?: any, request?: NextRequest) {
    try {
        await prisma.adminLog.create({
            data: {
                adminId,
                action,
                targetType,
                targetId,
                details,
                ipAddress: request?.headers.get('x-forwarded-for') || request?.headers.get('x-real-ip') || 'unknown'
            }
        });
    } catch (error) {
        console.error('Error logging admin action:', error);
    }
}

// GET - List all reports
export async function GET(request: NextRequest) {
    try {
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const status = searchParams.get('status') || '';
        const reportedType = searchParams.get('reportedType') || '';

        const skip = (page - 1) * limit;

        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (reportedType) {
            where.reportedType = reportedType;
        }

        const [reports, total, stats] = await Promise.all([
            prisma.report.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.report.count({ where }),
            prisma.report.groupBy({
                by: ['status'],
                _count: true
            })
        ]);

        return NextResponse.json({
            reports,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            stats: {
                pending: stats.find(s => s.status === 'pending')?._count || 0,
                reviewed: stats.find(s => s.status === 'reviewed')?._count || 0,
                resolved: stats.find(s => s.status === 'resolved')?._count || 0,
                dismissed: stats.find(s => s.status === 'dismissed')?._count || 0
            }
        });

    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// POST - Create a report (for testing or manual creation)
export async function POST(request: NextRequest) {
    try {
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const body = await request.json();
        const { reporterId, reportedType, reportedId, reason, description } = body;

        const report = await prisma.report.create({
            data: {
                reporterId,
                reportedType,
                reportedId,
                reason,
                description
            }
        });

        return NextResponse.json({ report, message: 'Signalement créé avec succès' });

    } catch (error) {
        console.error('Error creating report:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// PATCH - Update report status
export async function PATCH(request: NextRequest) {
    try {
        const accessCheck = await checkAdminAccess();
        if ('error' in accessCheck) {
            return NextResponse.json({ error: accessCheck.error }, { status: accessCheck.status });
        }

        const body = await request.json();
        const { reportId, status, resolution } = body;

        const report = await prisma.report.update({
            where: { id: reportId },
            data: {
                status,
                resolution,
                reviewedBy: accessCheck.adminId,
                reviewedAt: new Date()
            }
        });

        // Log admin action
        await logAdminAction(
            accessCheck.adminId,
            `report_${status}`,
            'report',
            reportId,
            { resolution },
            request
        );

        return NextResponse.json({ report, message: 'Signalement mis à jour avec succès' });

    } catch (error) {
        console.error('Error updating report:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
