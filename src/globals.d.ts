declare function renderMathInElement(
  element: HTMLElement,
  options?: any // You can refine this with KaTeX's options type later
): void;
type BlogPost = {
  data: {
    title: string;
    author: string;
    authorLink: string;
    date: string;
    description: string;
  };
  render: () => Promise<{ Content: any }>;
  content: any;
  url: string;
};
