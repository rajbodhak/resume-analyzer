'use client';

// Logo component
const Logo = (props: React.SVGAttributes<SVGElement>) => {
    return (
        <svg width='1em' height='1em' viewBox='0 0 324 323' fill='currentColor' xmlns='http://www.w3.org/2000/svg' {...props}>
            <rect
                x='88.1023'
                y='144.792'
                width='151.802'
                height='36.5788'
                rx='18.2894'
                transform='rotate(-38.5799 88.1023 144.792)'
                fill='currentColor'
            />
            <rect
                x='85.3459'
                y='244.537'
                width='151.802'
                height='36.5788'
                rx='18.2894'
                transform='rotate(-38.5799 85.3459 244.537)'
                fill='currentColor'
            />
        </svg>
    );
};

// Types
export interface NavbarProps {
    logo?: React.ReactNode;
    logoHref?: string;
    logoText?: string;
    signInText?: string;
    signInHref?: string;
    ctaText?: string;
    ctaHref?: string;
    onSignInClick?: () => void;
    onCtaClick?: () => void;
    className?: string;
}

export default function Navbar({
    logo = <Logo />,
    logoHref = '#',
    logoText = 'Resume Analyzer',
    signInText = 'Sign In',
    signInHref = '#signin',
    ctaText = 'Get Started',
    ctaHref = '#get-started',
    onSignInClick,
    onCtaClick,
    className = '',
}: NavbarProps) {
    return (
        <header
            className={`sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 ${className}`}
        >
            <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
                {/* Left side - Logo */}
                <a
                    href={logoHref}
                    className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors"
                >
                    <div className="text-2xl">{logo}</div>
                    <span className="font-bold text-xl">{logoText}</span>
                </a>

                {/* Right side - Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            if (onSignInClick) onSignInClick();
                            else window.location.href = signInHref;
                        }}
                        className="text-sm font-medium px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        {signInText}
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            if (onCtaClick) onCtaClick();
                            else window.location.href = ctaHref;
                        }}
                        className="text-sm font-medium px-4 h-9 rounded-md shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        {ctaText}
                    </button>
                </div>
            </div>
        </header>
    );
}

export { Logo };