import type { InferEntrySchema, Render, RenderedContent } from "astro:content";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
type Post = {
  id: string;
  render(): Render[".md"];
  slug: string;
  body: string;
  collection: "docs";
  data: InferEntrySchema<"docs">;
  rendered?: RenderedContent;
  filePath?: string;
};
import { useState } from "react";

const seps = [{ data: { title: "Venice Program Table", order: -0.5 } }];

export default function DocsNav({
  posts,
  post,
}: {
  posts: Post[];
    post: Post;
}) {
  const [isOpen, setIsOpen] = useState(false)
  const sorted = (posts as (Post | { data: { title: string, order: number }, id: null })[])
    .concat(seps.map(s => ({...s, id: null})))
    .sort((a, b) => (a.data.order) - (b.data.order));
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex flex-col gap-2 border-2 rounded-lg border-accent bg-white/50 mb-4 w-full p-3.5"
    >
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-lg font-serif my-auto">
          currently on <em>{ post.data.title }</em>
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="icon" className="size-8">
            {!isOpen ? <ChevronDown /> : <ChevronUp />}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="flex flex-col gap-2">
        {
          sorted.map(p =>
            p.id ?
            <a href={`/docs/${p.slug}`} className={`!border-b-0 p-2 rounded-2 rounded-xl ${p.id === post.id ? 'bg-accent/20' : 'hover:bg-accent/10'}`} key={p.id}>{ p.data.title }</a>
            :
              <span key={p.id} className="text-sm text-foreground/70">{p.data.title}</span>
          )
        }
      </CollapsibleContent>
    </Collapsible>
  );
  // return (
  //   <>
  //     <Accordion
  //       type="single"
  //       collapsible
  //       defaultValue="item-1"
  //       className="w-full border-1 open:border-5 p-2"
  //     >
  //       <AccordionItem value="item-1">
  //         <AccordionTrigger>Currently on <b>{post.data.title}</b></AccordionTrigger>
  //         <AccordionContent className="flex flex-col gap-4 text-balance">
  //           <p>
  //             Our flagship product combines cutting-edge technology with sleek
  //             design. Built with premium materials, it offers unparalleled
  //             performance and reliability.
  //           </p>
  //           <p>
  //             Key features include advanced processing capabilities, and an
  //             intuitive user interface designed for both beginners and experts.
  //           </p>
  //         </AccordionContent>
  //       </AccordionItem>
  //     </Accordion>
  //   </>
  // );
}
