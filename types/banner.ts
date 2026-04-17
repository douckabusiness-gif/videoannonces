export interface BannerSlide {
    id: string;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    videoUrl: string;
    order: number;
}

export interface BannerConfig {
    enabled: boolean;
    slides: BannerSlide[];
}
