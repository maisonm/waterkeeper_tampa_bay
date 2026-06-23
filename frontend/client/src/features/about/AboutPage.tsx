const TBWK_MONITORING_URL = "https://www.tampabaywaterkeeper.org/water-quality-monitoring"
const TBWK_HOME_URL = "https://www.tampabaywaterkeeper.org/get-involved"
const TBWK_DATA_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1wZwgVKnPEPl89H9da28pH2cq9HWJ8Ixm/edit?rtpof=true&sd=true"
const CONTACT_EMAIL = "maison.moa@gmail.com"

const externalLinkClass =
  "text-sky-600 underline-offset-4 hover:underline dark:text-sky-400"

const AboutPage = () => (
  <div className="mx-auto max-w-3xl px-8 py-10">
    <header className="space-y-3">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">About</h1>
      <p className="text-lg text-muted-foreground">
        This is simply a personal project for tracking Tampa Bay water quality over time. Currently this just tracks Enterococci bacteria levels, but will be expanded on as time permits. 
      </p>
    </header>

    <div className="mt-10 space-y-10 text-foreground">
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">The data</h2>
        <p className="leading-relaxed text-muted-foreground">
          This dashboard uses sample data collected and published by{" "}
          <a
            href={TBWK_MONITORING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={externalLinkClass}
          >
            Tampa Bay Waterkeeper (partnered with USF Water Institute)
          </a>
          . These TBWK results show Enterococci bacteria levels at sites around the bay on a regular bi-weekly schedule, which are shared publicly. None of the data used for this dashboard would exist without their continued efforts in testing and monitoring water quality in Tampa Bay.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          The app pulls from the same{" "}
          <a
            href={TBWK_DATA_SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={externalLinkClass}
          >
            testing results spreadsheet
          </a>{" "}
          Tampa Bay Waterkeeper maintains. It syncs twice a week, so what you see here should stay close to what they have posted and updated in the results spreadsheet. Currently, they test and report results bi-weekly from various sites in the bay. You can always check their Website and Social Media for the most recent results.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          For the latest results, program details, and ways to get involved with water quality initiatives
          in the bay, visit{" "}
          <a
            href={TBWK_HOME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={externalLinkClass}
          >
            Tampa Bay Waterkeeper
          </a>
          . They are the source. This site is just another way to look at the numbers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What this dashboard does</h2>
        <p className="leading-relaxed text-muted-foreground">
          The goal is simple: make it easier to see how water quality changes across Tampa Bay over
          time. You can filter by date range and sampling site, browse results in a table, see where
          sites are on a map, and look at charts that plot enterococci levels (and precipitation)
          across the weeks and months samples were taken.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Whether you want a snapshot of the most recent sampling day or a longer view of how a
          particular site has trended over time, the filters and charts are built for that. Historical
          context matters and gives us a good look at how water quality is trending over time. 
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Why I built it</h2>
        <p className="leading-relaxed text-muted-foreground">
          I&apos;m a Florida native and a software engineer. I&apos;ve lived in Tampa Bay for the
          past six years. I fish these waters weekly, and done so for
          more than a decade. The bay&apos;s condition shows up in day-to-day life if you spend
          time on, or in, the water. I built this because I wanted a clearer picture of the trends behind
          those good weeks and bad ones.
        </p>
      </section>

      <section className="space-y-3 border-t border-border pt-10">
        <h2 className="text-xl font-semibold">Feedback and the API</h2>
        <p className="leading-relaxed text-muted-foreground">
          This project is a work in progress, which will eventually include more than just Enterococci results. I&apos;m open to requests for updates and new features. If something would make this more
          useful to you, or if you want to build on top of the data yourself, reach out at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className={externalLinkClass}>
            {CONTACT_EMAIL}
          </a>
          . I can also share documentation for the small API that serves this data from the Google
          Sheet.
        </p>
      </section>
    </div>
  </div>
)

export default AboutPage
