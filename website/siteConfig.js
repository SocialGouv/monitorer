// https://docusaurus.io/docs/site-config
const siteConfig = {
  baseUrl: "/monitorer/",
  cleanUrl: true,
  colors: {
    primaryColor: "#222222",
    secondaryColor: "#555555",
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
    { search: true },
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
  tagline: "A deploy-in-one-click web services uptime monitor",
  title: "Monitorer",
  twitter: false,
  twitterUsername: "BetaGouv",
  url: "https://SocialGouv.github.io",
  users: [],
};

module.exports = siteConfig;
