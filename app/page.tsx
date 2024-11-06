import { Footer } from "./(marketing)/_components/footer";
import { Heading } from "./(marketing)/_components/heading";
import { Heroes } from "./(marketing)/_components/heros";
import Navbar from "./(marketing)/_components/navbar";

const MarketingPage = () => {
    return (
        <div className="min-h-full flex flex-col">
            <div className="flex flex-col items-center justify-center md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
                <Navbar />
                <Heading />
                <Heroes />
            </div>
            <Footer />
        </div>
    );
}

export default MarketingPage;