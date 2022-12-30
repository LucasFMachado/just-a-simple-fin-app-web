import Head from "next/head";

interface PageTitleProps {
  title: string;
}

export function PageTitle({ title }: PageTitleProps) {
  return (
    <Head>
      <title>FinAPP | {title}</title>
    </Head>
  );
}
