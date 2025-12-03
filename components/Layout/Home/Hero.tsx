import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import Link from 'next/link'
import heroBg from "@/app/images/hero-bg.png"

export default function Hero() {
    return (
        <section
            className="relative bg-cover bg-center bg-no-repeat py-32 lg:py-52 xl:py-64  text-white"
            style={{ backgroundImage: `url(${heroBg.src})` }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-primary/50 backdrop-blur-[5px]"></div>

            <div className="relative max-w-6xl mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg ">
                    Explore Cities Like a Local
                </h1>

                <p className="text-lg md:text-xl mb-8 text-white/95 max-w-2xl mx-auto drop-shadow">
                    Connect with passionate local guides for truly authentic experiences.
                </p>

                {/* Search Bar */}
                <div className="bg-white rounded-full shadow-xl p-3 flex items-center gap-3 max-w-xl mx-auto border border-white/30">
                    <Search className="text-gray-500" />
                    <input
                        placeholder="Where are you going?"
                        className="flex-1 outline-none text-gray-700 text-base"
                    />
                    <Button className="rounded-full px-6 bg-blue-600 hover:bg-blue-700">
                        Search
                    </Button>
                </div>

                {/* CTA */}
                <Link href="/register?role=guide">
                    <Button className="mt-10 bg-linear-to-br
                            from-[#0b1ae9]
                            to-[color-mix(in_srgb,rgb(11,26,233)_80%,rgb(255,107,107))] text-white font-semibold hover:bg-yellow-500 px-10 py-5 rounded-full shadow-lg">
                        Become a Guide
                    </Button>
                </Link>
            </div>
        </section>
    )
}
