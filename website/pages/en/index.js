const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const { siteConfig, language = "" } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    // const Logo = props => (
    //   <div className="projectLogo">
    //     <img src={props.img_src} alt="Project Logo" />
    //   </div>
    // );

    const ProjectTitle = props => (
      <h2 className="projectTitle">
        {props.title}
        <small>
          A highly customizable deploy-in-one-click application
          <br />
          to monitor your web services uptime and latency.
        </small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a
          className="button"
          href={props.href}
          rel={props.target !== undefined ? "noreferrer noopener" : undefined}
          target={props.target}
        >
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        {/* <Logo img_src={`${baseUrl}img/undraw_operating_system.svg`} /> */}
        <div className="inner">
          <ProjectTitle tagline={siteConfig.tagline} title={siteConfig.title} />
          <PromoSection>
            <Button href="https://socialgouv-monitor.herokuapp.com" target="_blank">
              Live Example
            </Button>
            <Button href={docUrl("getting-started")}>Getting Started</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl } = siteConfig;

    const Block = props => (
      <Container padding={["bottom", "top"]} id={props.id} background={props.background}>
        <GridBlock align="center" contents={props.children} layout={props.layout} />
      </Container>
    );

    const Features = () => (
      <Block background="light" layout="fourColumn">
        {[
          {
            content: "Deploy Monitorer on the most popular PaaS in seconds.",
            image: `${baseUrl}img/undraw_time_management_30iu.svg`,
            imageAlign: "top",
            title: "One-Click Deployment",
          },
          {
            content: "Monitor 100+ web services on the cheapest PaaS instances.",
            image: `${baseUrl}img/undraw_Outer_space_drqu.svg`,
            imageAlign: "top",
            title: "Highly Scalable",
          },
          {
            content: "A single YAML file to configure everything.",
            image: `${baseUrl}img/undraw_Birthday_cake_2wxy.svg`,
            imageAlign: "top",
            title: "Painless Configuration",
          },
          {
            content: "Customize (almost) everything. Or don't 🐰.",
            image: `${baseUrl}img/undraw_sunlight_tn7t.svg`,
            imageAlign: "top",
            title: "Fully Customizable",
          },
        ]}
      </Block>
    );

    // const Dashboard = () => (
    //   <Block background="dark">
    //     {[
    //       {
    //         content: "",
    //         image: `${baseUrl}img/screenshot-dashboard.png`,
    //         imageAlign: "right",
    //         title: "Monitorer Dashboard",
    //       },
    //     ]}
    //   </Block>
    // );

    // const Administration = () => (
    //   <Block background="light">
    //     {[
    //       {
    //         content: "",
    //         image: `${baseUrl}img/screenshot-administration.png`,
    //         imageAlign: "left",
    //         title: "Monitorer Administration",
    //       },
    //     ]}
    //   </Block>
    // );

    // const Showcase = () => {
    //   if ((siteConfig.users || []).length === 0) {
    //     return null;
    //   }

    //   const showcase = siteConfig.users
    //     .filter(user => user.pinned)
    //     .map(user => (
    //       <a href={user.infoLink} key={user.infoLink}>
    //         <img src={user.image} alt={user.caption} title={user.caption} />
    //       </a>
    //     ));

    //   const pageUrl = page => baseUrl + (language ? `${language}/` : "") + page;

    //   return (
    //     <div className="productShowcaseSection paddingBottom">
    //       <h2>Who is Using This?</h2>
    //       <p>This project is used by all these people</p>
    //       <div className="logos">{showcase}</div>
    //       <div className="more-users">
    //         <a className="button" href={pageUrl("users.html")}>
    //           More {siteConfig.title} Users
    //         </a>
    //       </div>
    //     </div>
    //   );
    // };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Features />
          {/* <Dashboard /> */}
          {/* <Administration /> */}
          {/* <Showcase /> */}
        </div>
      </div>
    );
  }
}

module.exports = Index;
