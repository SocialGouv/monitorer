// https://docusaurus.io/docs/site-config
const siteConfig = {
  baseUrl: "/monitorer/",
  cleanUrl: true,
  colors: {
    primaryColor: "#10910e",
    prismColor: "rgba(153, 66, 79, 0.03)",
    secondaryColor: "#095708",
  },
  docsSideNavCollapsible: false,
  editUrl: "https://github.com/SocialGouv/monitorer/tree/master/docs/",
  enableUpdateBy: true,
  enableUpdateTime: true,
  favicon: "img/favicon.ico",
  footerIcon: "img/favicon.ico",
  // headerIcon: "img/favicon.ico",
  headerLinks: [
    { doc: "getting-started", label: "Docs" },
    // { languages: true },
    // { search: true },
    { href: "https://github.com/SocialGouv/monitorer", label: "Github" },
  ],
  highlight: {
    theme: "default",
  },
  // ogImage: "img/undraw_operating_system.svg",
  onPageNav: "separate",
  organizationName: "SocialGouv",
  projectName: "monitorer",
  repoPath: "SocialGouv/monitorer",
  scripts: [],
  tagline:
    "A highly customizable deploy-in-one-click application to monitor your web services uptime and latency",
  title: "Monitorer",
  twitter: false,
  twitterUsername: "BetaGouv",
  url: "https://SocialGouv.github.io",
  users: [],
};

module.exports = siteConfig;
