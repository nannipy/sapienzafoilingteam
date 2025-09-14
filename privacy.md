var _excluded = ["components"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/* @jsxRuntime classic */
/* @jsx mdx */

var _frontmatter = {
  "title": "Privacy compliance",
  "sidebarTitle": "Overview",
  "sidebar": "Docs",
  "showTitle": true
};
var layoutProps = {
  _frontmatter: _frontmatter
};
var MDXLayout = "wrapper";
return function MDXContent(_ref) {
  var components = _ref.components,
    props = _objectWithoutProperties(_ref, _excluded);
  return mdx(MDXLayout, _extends({}, layoutProps, props, {
    components: components,
    mdxType: "MDXLayout"
  }), mdx("p", null, "Posthog gives you privacy controls at different levels to protect user privacy and comply with regulations.\nThis guide covers the different privacy controls we provide and guidance on how to use them."), mdx("ul", null, mdx("li", {
    parentName: "ul"
  }, mdx("strong", {
    parentName: "li"
  }, "What you're responsible for"), ": It's your responsibility to decide what data you collect, if it complies with regulations, and communicate with your users."), mdx("li", {
    parentName: "ul"
  }, mdx("strong", {
    parentName: "li"
  }, "What PostHog does for you"), ": We provide tools and features to help you manage what's collected and store the collected data securely.")), mdx("h2", {
    "id": "privacy-control-features"
  }, "Privacy control features"), mdx("p", null, "You can control data collection, ingestion, and storage at different levels. Explore the guides below to learn more about the different privacy control features:"), mdx("ul", null, mdx("li", {
    parentName: "ul"
  }, mdx("a", {
    parentName: "li",
    "href": "/docs/privacy/data-collection"
  }, "Manage data collection")), mdx("li", {
    parentName: "ul"
  }, mdx("a", {
    parentName: "li",
    "href": "/docs/privacy/data-storage#processing-data-before-storage"
  }, "Manage data processing")), mdx("li", {
    parentName: "ul"
  }, mdx("a", {
    parentName: "li",
    "href": "/docs/privacy/data-storage"
  }, "Manage data storage"))), mdx("h2", {
    "id": "guidance-on-navigating-regulations"
  }, "Guidance on navigating regulations"), mdx("p", null, "In these guides, we offer advice for using PostHog in a compliant manner under the following legal frameworks:"), mdx("ul", null, mdx("li", {
    parentName: "ul"
  }, mdx("p", {
    parentName: "li"
  }, mdx("a", {
    parentName: "p",
    "href": "/docs/privacy/gdpr-compliance/"
  }, "The General Data Protection Regulation"), " (GDPR), which applies to all businesses collecting data on EU citizens")), mdx("li", {
    parentName: "ul"
  }, mdx("p", {
    parentName: "li"
  }, mdx("a", {
    parentName: "p",
    "href": "/docs/privacy/hipaa-compliance/"
  }, "The Health Insurance Portability and Accountability Act"), " (HIPAA), which applies to businesses capturing and processing health data in the US")), mdx("li", {
    parentName: "ul"
  }, mdx("p", {
    parentName: "li"
  }, mdx("a", {
    parentName: "p",
    "href": "/docs/privacy/ccpa-compliance/"
  }, "The California Consumer Privacy Act"), " (CCPA), which applies to qualifying for-profit businesses collecting personal information on residents of California"))), mdx(CalloutBox, {
    type: "info",
    title: "These are not legal advice",
    mdxType: "CalloutBox"
  }, mdx("p", null, "It is up to you to ensure you're compliant with regulations. We strongly recommend reading the relevant regulations in full and seeking independent legal advice regarding your obligations. ")), mdx("h2", {
    "id": "frequently-asked-questions"
  }, "Frequently asked questions"), mdx("p", null, "This overview covers some frequently asked questions about PostHog and privacy. Have a question not covered here? Use the 'Ask a question' box at the bottom of the page."), mdx("h3", {
    "id": "is-it-ok-for-my-api-key-to-be-exposed-and-public"
  }, "Is it ok for my API key to be exposed and public?"), mdx(ExposedApiKeys, {
    mdxType: "ExposedApiKeys"
  }), mdx("h3", {
    "id": "what-is-and-isnt-considered-personal-data"
  }, "What is and isn't considered personal data?"), mdx("p", null, "It's hard to have a single legal definition of personal data because every legal privacy framework has different ideas, and even names, for it. The GDPR calls it 'personal data' but the US uses the term 'personally identifiable information' (PII) and others refer to it as 'personal information'."), mdx("p", null, "According to the GDPR, personal data is any information which: "), mdx("ol", null, mdx("li", {
    parentName: "ol"
  }, "Identifies a 'data subject' directly"), mdx("li", {
    parentName: "ol"
  }, "Can be used to identify a 'data subject' when combined with other information")), mdx("p", null, "Read our ", mdx("a", {
    parentName: "p",
    "href": "/blog/what-is-personal-data-pii"
  }, "simple guide to personal data and PII"), " for more specific examples to help you identify what personal data you are collecting."), mdx("h3", {
    "id": "how-does-the-gdpr-impact-analytics"
  }, "How does the GDPR impact analytics?"), mdx("p", null, "There are three key GDPR principles that impact your use PostHog and analytics in general:"), mdx("ol", null, mdx("li", {
    parentName: "ol"
  }, "You need to have a good reason to collect personal data"), mdx("li", {
    parentName: "ol"
  }, "You need to acquire unambiguous consent"), mdx("li", {
    parentName: "ol"
  }, "Data must be handled securely")), mdx("p", null, "Our ", mdx("a", {
    parentName: "p",
    "href": "/blog/what-is-personal-data-pii"
  }, "guide to personal data"), " provides an overview of what's considered personal data under the GDPR, but suffice it to say that its definition is broad."), mdx("h3", {
    "id": "is-posthog-gdpr-compliant"
  }, "Is PostHog GDPR compliant?"), mdx("p", null, "We have ", mdx("a", {
    parentName: "p",
    "href": "/docs/privacy/gdpr-compliance"
  }, "in-depth GDPR guidance documentation"), " for advice on deploying PostHog in a GDPR-compliant way, including ", mdx("a", {
    parentName: "p",
    "href": "/docs/privacy/gdpr-compliance#step-4-configure-consent"
  }, "how to configure GDPR consent in PostHog"), " and complying with ", mdx("a", {
    parentName: "p",
    "href": "/docs/privacy/gdpr-compliance#complying-with-right-to-be-forgotten-requests"
  }, "'right to be forgotten' requests"), "."), mdx("p", null, "We also offer ", mdx("a", {
    parentName: "p",
    "href": "https://eu.posthog.com/signup"
  }, "PostHog Cloud EU"), " \u2013 a managed version of PostHog with servers hosted in Frankfurt, ensuring user data never leaves EU jurisdiction. "), mdx("h3", {
    "id": "can-i-use-posthog-cloud-under-hipaa"
  }, "Can I use PostHog Cloud under HIPAA?"), mdx("p", null, "Yes, we can provide a Business Associate Agreement (BAA) to enable HIPAA-compliant usage of PostHog Cloud. Please ", mdx("a", {
    parentName: "p",
    "href": "/talk-to-a-human"
  }, "contact us to arrange a BAA and discuss your requirements"), ". "), mdx("h3", {
    "id": "is-google-analytics-hipaa-compliant"
  }, "Is Google Analytics HIPAA compliant?"), mdx("p", null, "No, ", mdx("a", {
    parentName: "p",
    "href": "/blog/is-google-analytics-hipaa-compliant"
  }, "Google Analytics isn't HIPAA compliant"), ", so it can't be used in any context where you're collecting or processing personal health information. PostHog can be used to collect user data under HIPAA. Read our ", mdx("a", {
    parentName: "p",
    "href": "/docs/privacy/hipaa-compliance"
  }, "HIPAA guidance"), " for more information."));
}
;
MDXContent.isMDXComponent = true;