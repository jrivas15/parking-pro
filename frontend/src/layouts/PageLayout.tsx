
const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex flex-col gap-4 px-4  h-[calc(100vh-6rem)] overflow-hidden">
        {children}
    </section>
  )
}

export default PageLayout
