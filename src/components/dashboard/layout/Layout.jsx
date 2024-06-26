import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <>
      <div className="flex font-roboto">
        <div className="w-[200px] sidebar shadow-cb">
          <Sidebar />
        </div>
        <div className="flex-auto min-h-screen">
          <Header>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossrigin
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
              rel="stylesheet"
            />
          </Header>
          <main className="p-2 min-h-[calc(100vh-72px)] bg-[#f8f8f8]">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
