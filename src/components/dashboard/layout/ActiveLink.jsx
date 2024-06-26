import { withRouter } from "next/router";

const ActiveLink = ({ router, href, children }) => {
  (function prefetchPages() {
    if (typeof window !== "undefined") {
      router.prefetch(router.pathname);
    }
  })();

  const handleClick = (event) => {
    event.preventDefault();
    router.push(href);
  };
  const isCurrentPath = router.pathname === href || router.asPath === href;
  return (
    <div>
      <a
        href={href}
        onClick={handleClick}
        className={
          isCurrentPath ? "text-primary font-bold tracking-wide" : "text:yellow"
        }
      >
        {children}
      </a>
    </div>
  );
};

export default withRouter(ActiveLink);
