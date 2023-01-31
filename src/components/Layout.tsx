import { FunctionComponent } from "react";
import classNames from "classnames";
import Header from "./Header";
import Footer from "./Footer";
import { MessageList, useMessage } from "./message";
import Breadcrumb from "./Breadcrumb";

type LayoutProps = {
  usePadding?: boolean;
  useBackdrop?: boolean;
  children: React.ReactNode;
};

const FullLayout: FunctionComponent<LayoutProps> = ({
  children,
  usePadding,
  useBackdrop,
}) => {
  const { messages } = useMessage();

  // Capitalize the first letter of each word in a string
  function titleize(path: string): string {
    return path
      .split("/")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <>
      <Header />

      <Breadcrumb getDefaultTextGenerator={(path) => titleize(path)} />

      <main
        className={classNames(
          "w-full h-screen mx-auto relative",
          usePadding && "px-2 sm:px-6 lg:px-8",
          useBackdrop && "bg-gray-200"
        )}
      >
        <MessageList messages={messages ?? []} />
        {children}
      </main>

      <Footer>.</Footer>
    </>
  );
};

FullLayout.defaultProps = {
  usePadding: true,
  useBackdrop: false,
};

export default FullLayout;
