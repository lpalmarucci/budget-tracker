"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { PropsWithChildren } from "react";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
      <ProgressBar height="4px" color="#f97316" options={{ showSpinner: false }} shallowRouting />
    </>
  );
};

export default Providers;
