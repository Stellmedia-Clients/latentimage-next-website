import type { Metadata } from "next";
import PageHeader from "../components/PageHeader";
import ProjectTabs from "./ProjectTabs";
import { projectsPage } from "../copy";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected visual stories created for architecture, hospitality, real estate and brands.",
};

export default function Projects() {
  return (
    <>
      <PageHeader
        eyebrow={projectsPage.eyebrow}
        title={projectsPage.title}
        lead={projectsPage.lead}
      />
      <ProjectTabs />
    </>
  );
}
