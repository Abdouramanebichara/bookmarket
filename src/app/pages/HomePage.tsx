import { HeroSection } from '../components/HeroSection';
import { BookstoresCarousel } from '../components/BookstoresCarousel';
import { PopularProducts } from '../components/PopularProducts';
import { Categories } from '../components/Categories';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <BookstoresCarousel />
      <PopularProducts />
      <Categories />
    </>
  );
}
