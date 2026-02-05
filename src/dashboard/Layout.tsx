import Sidebar from './components/Sidebar';
import Header from './components/Header';

interface LayoutProps {
    children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="grid grid-cols-[auto_2fr] h-screen ">
      <Sidebar />
      <div className="grid grid-rows-[auto_1fr]">
        <Header />
        
      </div>
    </div>
  )
}

export default Layout
