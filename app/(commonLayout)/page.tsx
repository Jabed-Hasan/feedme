import About from "@/components/home/about";
import Header from "@/components/home/header";
import OurTeam from "@/components/home/ourTeam";
import ServingCustomer from "@/components/home/servingCustomer";
import Categories from "@/components/home/categories";
import Blog from "@/components/home/blog";
import Testimonials from "@/components/home/testimonials";
import Newsletter from "@/components/home/newsletter";

const Home = () => {
  return (
    <>
      <Header />
      <About />
      <Categories />
      <ServingCustomer />
      <Testimonials />
      <Blog />
      <OurTeam />
      <Newsletter />
    </>
  );
};

export default Home;
