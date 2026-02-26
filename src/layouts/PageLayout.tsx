
const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="flex flex-col gap-4 p-4 overflow-y-auto h-[calc(100vh-6rem)]">
        {children}
    </section>
  )
}

export default PageLayout
