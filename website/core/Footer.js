const React = require("react");

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : "") + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl("getting-started", this.props.language)}>Getting Started</a>
            <a href={this.docUrl("configuration", this.props.language)}>Configuration</a>
          </div>
          <div>
            <h5>Community</h5>
            <a href="https://github.com/SocialGouv" rel="noopener noreferrer" target="_blank">
              Github organization
            </a>
            <a
              href="https://incubateur.social.gouv.fr"
              lang="fr"
              rel="noopener noreferrer"
              target="_blank"
            >
              Fabrique numérique des Ministères Sociaux
              <sup>[fr]</sup>
            </a>
          </div>
          <div>
            <a
              href={`https://github.com/${this.props.config.repoPath}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                alt={`Star @${this.props.config.repoPath} on Github`}
                src={`https://img.shields.io/github/stars/${this.props.config.repoPath}?color=4078c0&logo=github&style=for-the-badge`}
              />
            </a>
            <a
              href={`https://twitter.com/${this.props.config.twitterUsername}`}
              lang="fr"
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                alt={`Follow @${this.props.config.twitterUsername}`}
                src={`https://img.shields.io/twitter/follow/${this.props.config.twitterUsername}?color=1da1f2&logo=twitter&style=for-the-badge`}
              />
            </a>
          </div>
        </section>

        <a
          className="fbOpenSource"
          href="https://beta.gouv.fr"
          lang="fr"
          rel="noreferrer noopener"
          target="_blank"
        >
          <img src={`${this.props.config.baseUrl}img/betagouv-logo.svg`} alt="beta.gouv.fr" />
        </a>
      </footer>
    );
  }
}

module.exports = Footer;
