Complete guide to event tracking

    Ian Vanagas
    Yakko Majuri

Jun 11, 2024

Event tracking is the first step in improving your product. It enables you to understand how users are interacting with your app by capturing interaction and behavioral data. This helps you figure out how best to improve it.

At PostHog, we offer two ways to track events: autocapture and custom events. This tutorial addresses both, starting by walking through autocapture setup, then diving deeper into custom events, and finally refining those custom events to capture the data you need.
Setting up autocapture

Unlike other tools, PostHog doesn't require you to pre-define or set up events. We can autocapture them for you. This makes it easy to start capturing data like pageviews, clicks, and form submissions.

The fastest way to set up autocapture is to copy the snippet below and paste it into your site’s HTML in the <head> tags. This should be an HTML page that acts as a base or template page (with other scripts your page loads) to ensure all possible events are captured.
HTML

<script>
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  posthog.init('phc_7LG86a9Aw5gLQegW0xmeyL8PKkIFafZ0GO0npHD4iaw',{api_host:'https://eu.i.posthog.com', defaults:'2025-05-24'})
</script>

    Alternative: Alternatively, you can install one of the SDKs such as JavaScript Web, React, or React Native.

Once setup, this autocaptures events like pageviews, clicks, change of inputs, or submission of a, button, form, input, select, textarea, and label tags. Those events flow automatically into PostHog for you to see and analyze.

Autocapture can also capture non-event data like session duration, mouse movement, bounce rate, performance, and more. You can learn more about this in the autocapture docs.
Autocapture’s limitations

Although autocapture is a great way to get started, it can be limiting for more advanced event tracking. This is for three reasons:

    Lack of signal. Since autocapture captures everything, it can be difficult to know what events matter, especially for high-traffic sites and apps. You need to have an idea of what you care about and then use filters, actions, and insights to focus on it. The web analytics dashboard does this well.

    Frontend only. Autocapture only works on the frontend. This enables you to capture events from your website or app, but not your server.

    Customization. Although it is possible to add properties to autocapture, getting exactly the data you want at the exact moment you want requires customization.

    Pageviews rely on page loads. Pageview captures rely on page load events. This means they don't work well with single-page apps (SPAs). To fix this, you can rely on the history API to capture pageviews by setting the capture_pageview configuration option to history_change or by using the most recent defaults: '2025-05-24'.

Setting up custom events

In addition to autocapture, PostHog enables you to set up custom events in your product. This enables you to capture whatever data you want wherever in your codebase. This ensures correct and comprehensive event tracking.

To set up custom events, first you need to install the SDK for the language you are using. We have built SDKs for a range of languages and frameworks including Node, Python, iOS, Android, and more. You can even use our event capture API directly.

For example, with Python (and frameworks like Django or Flask), setting up custom events starts with installing the PostHog with pip (or your package manager of choice).
Terminal

pip install posthog

Second, with the SDK you chose, you need to configure PostHog. This includes adding your project’s API key and host. You can get these in your project settings.
Python

import posthog

# Substitutes posthog.api_key which still exists but has been deprecated
posthog.project_api_key = 'phc_7LG86a9Aw5gLQegW0xmeyL8PKkIFafZ0GO0npHD4iaw'

# You can remove this line if you're using us.i.posthog.com
posthog.host = 'https://eu.i.posthog.com'

Third, once the SDK is installed and configured, you can capture events by calling library methods with the event name, user distinct ID, and properties. For example, in Python a capture call might look like this:
Python

def movie_played(movie):
    posthog.capture(
        'distinct_id',
        'movie_played',
        {
            'movie_id': movie.id,
            'category': movie.category
        }
    )

Adding more of these capture calls in the right places in your codebase creates a flow of event tracking data into PostHog.
Getting custom events right

Once you send some custom events, it's time to refine those events to capture the data you want. Getting this right requires multiple steps:

    Start with your product goals, which inform what data is needed about users and their behavior.

    Ensure data is accessible in the right places in your codebase. This might require writing helper functions for access or formatting the data correctly.

    Ensure captured data is being captured successfully and in the right format.

To make sure your data is correct and useful, there are few areas you should pay attention to:
1. Identifying users

To best capture data about users, you must understand who they are.

Every event you capture must have a user distinct ID. Autocapture handles this for you, while custom events require you to do this yourself. Examples of identifiers for users include UUID values and emails.

To connect an anonymous user distinct ID created by autocapture with a user distinct ID you created, you can use the identify method:
JavaScript

function loginRequest(user) {
  return authUser(user)
    .then(authorizedUser => {
        posthog.identify(user.email)
    })
}

Identifying users enables you to track users across sessions and devices as well as use person profiles and properties in your analysis.
2. Properties

Properties are additional data added to events. They are used to segment users, filter events, break down event data, and more.

Properties are sent along with the distinct ID and event. They can include as much data as you like. Common data formats such as booleans, dates, numerics, and more can be handled and utilized within PostHog to filter or adjust data when analyzing.

posthog.capture(
  'event_name',
  { property1: 'value', property2: 'another value' }
);

Properties can also be set for individual users using the $set and $set_once properties. Person properties enable you to connect data to the person rather than the event. It also enables permanent user data to be stored across events, and not have to be recreated in each event capture call. Once a person property is $set_once it can’t be changed by calling $set_once again. For example:

posthog.capture(
  'set_some_user_properties',
  {
    $set: { location: 'London'  },
    $set_once: { referred_by: 'some ID' },
  }
)

3. Group event tracking

PostHog provides the ability to aggregate events by groups. Groups enable you to track events and properties at the entity level like a company, organization, or project. This enables you to do analysis like unique organization aggregations.

In our JavaScript Web snippet and SDK, you can call the group method and all subsequent events will be associated with that group. Other SDKs and the API require you to pass group data with each event.

// All subsequent events will be associated with company `id:5`
posthog.group('company', 'id:5');
posthog.capture('some_event')