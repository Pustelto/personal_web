---
title: "How to implement Supabase auth in a browser extension"
twitter: "Supabase promises easy authentication without a hassle.\nTurns out there was a lot to figure out.\nA detailed guide on how to handle authentication in a browser extension for Chrome and Firefox."
tags: ["Authentication", "Supabase", "Browser extension", "Clipio"]
excerpt: "Supabase promise an easy authentication without a hasle. Turns out there was a lot to figure out. In this article, I'll show you how I handle authentication in browser extension running in Chrome and Firefox."
date: 2024-05-17
published: true
---
 
Supabase promise an easy authentication without a hasle.

Turns out there was a lot to figure out.

While building [Clipio](https://clipio.app), I had to implement authentication in a browser extension without a regular website. I decide to use [Supabase](https://supabase.com/) and Supabase UI to setup everthing quickly. And while Supabase does a lot of heavy lifting, there was still a lot of work. And resources for this topic are rare.

In this article, I'll show you how I handle authentication in browser extension running in Chrome and Firefox.

**Quick tip:** Upload your extension into the Chrome and Mozilla stores (a signed self-hosted extension will do as well) as soon as possible to obtain stable extension IDs. You will need those for the OAuth setup. So doing this early will save you trouble changing the IDs and redirect URLs later.

Since this article is longer than usually here is the outline for a quick navigation: 

[[toc]]

## Initial attempt

When looking for resources I really couldn't find any complete guide. The best I could find is the article [Supabase login with OAuth for Chrome extensions](https://beastx.ro/supabase-login-with-oauth-in-chrome-extensions) from [Dragos Sebestin](https://twitter.com/sebestin_dragos). 

I managed to set up the basic authentication flow based on the amazing guide mentioned above. However, there was still a lot of work that was not covered.

### What I was missing

- **Email login & Password Reset**: handling email-based authentication requires additional changes and updates (mostly for password reset flow).
- **Session Management**: How to handle refreshing the session.
- **Logout Functionality**: Auth flow in the browser extension is spread across several origins. When the user logout we have to ensure all data is cleared.
- **Cross-Browser Support**: When building an extension that can run in multiple browsers (eg. Chrome and Firefox) requires a few more tweaks.
- **Supabase UI**: I decided to use Supabase UI to have the auth flow build quickly, but that requires some tweaking since some flow has to be handled manually from the parent component (eg. password reset).

## Basic setup

Following the guide mentioned above, we will open the auth flow in a new tab. In the case of the Clipio, that means checking if the user is logged in before the extension opens. If not the auth flow is initiated.

This code lives in the background script and will look like this:

```javascript
browser.action.onClicked.addListener(async tab => {
  await openClipio(tab);
});

const openLoginPage = async (type) => {
  await browser.tabs.create({
    url: browser.runtime.getURL('./src/pages/auth.html'),
    active: true,
  });
};

async function openClipio(tab) {
  const storageContent = await browser.storage.local.get(null);

  const { refresh_token } = storageContent;

  const session = await supabase.auth.refreshSession({ refresh_token });

  if (session.error) {
    await Promise.all([browser.storage.local.clear(), supabase.auth.signOut()]);
    await openLoginPage();
    return;
  }

  browser.tabs.sendMessage(tab.id, {
    action: 'open',
  });
}
```

Now let's build the auth screen that we will redirect the user to.

The initial version of our auth page will look like this. Please note I have removed the styles and unnecessary markup for the sake of brevity.

```tsx
const queryParams = {
  access_type: 'offline',
  prompt: 'consent',
}

export function Auth() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);

      if (session) {
        browser.runtime.sendMessage({ type: 'SET_AUTH', auth: session });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div>
        <h1>Login</h1>
        <SupabaseAuth
          supabaseClient={supabase}
          providers={['google']}
          queryParams={queryParams}
          redirectTo={browser.identity.getRedirectURL()}
        />
      </div>
    );
  } else {
    return (
      <div>
        <h1>Successfully logged in</h1>
        <p>You can now close this tab.</p>
      </div>
    );
  }
}
```

This example is taken from the official [Supabase guide for React](https://supabase.com/docs/guides/auth/quickstarts/react) and tweaked for the browser extension context.

Now we need to add a handler in the extension's background script watch for tabs change and finish the auth flow when the extension's redirect URL is open (code below is taken from Dragos guide).

```javascript
browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url?.startsWith(browser.identity.getRedirectURL())) {
    finishOAuthSignIn(changeInfo.url);
  }
});

async function finishUserOAuth(url: string) {
  try {
    console.log(`handling user OAuth callback ...`);
    const supabase = createClient(secrets.supabase.url, secrets.supabase.key);

    // extract tokens from hash
    const hashMap = parseUrlHash(url);
    const access_token = hashMap.get('access_token');
    const refresh_token = hashMap.get('refresh_token');
    if (!access_token || !refresh_token) {
      throw new Error(`no supabase tokens found in URL hash`);
    }

    // check if they work
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (error) throw error;

    // Persist session to storage - background script can become inactive and the session will be lost,
    // we need to be able to recover it by storing the tokens in extension's storage.
    await browser.storage.local.set({ session: data.session });

    // finally redirect to a post-oauth page
    browser.tabs.update({ url: 'https://myapp.com/user-login-success/' });

    console.log(`finished handling user OAuth callback`);
  } catch (error) {
    console.error(error);
  }
}

export function parseUrlHash(url: string) {
  const hashParts = new URL(url).hash.slice(1).split('&');
  const hashMap = new Map(
    hashParts.map(part => {
      const [name, value] = part.split('=');
      return [name, value];
    }),
  );

  return hashMap;
}
```

### Extension permissions

To make this all work, we have to add these permissions to the extension manifest:

```json
"permissions": [
  "identity",
  "tabs",
  "storage"
]
```

- Identity permission is necessary to have access to redirect URL
- Tabs permission is required to be able to observe changes in tabs URLs (so we can detect navigation to redirect URLs).
- Storage will be used to store the user session in the extension context

## Preparing the Google login

With all the code setup, all we have to do now is to enable Google auth in our Supabase project.

### Google Chrome:

For Google auth in Chrome I suggest taking a look at this [guide in Supabase docs](https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=platform&platform=chrome-extensions#configuration-chrome-extension). Since we are using Supabase UI we can skip the code part and skip down to the Configuration section:

1. Configure the [OAuth consent screen in Google Cloud Console (GCC)](https://console.cloud.google.com/apis/credentials/consent).
1. Add new credentials of type *Chrome extension* at the [credentials screen](https://console.cloud.google.com/apis/credentials).

### Mozilla Firefox

To support Google auth in Firefox we have to create a new credentials on GCC.

1. Visit the Credentials screen again and create a new credential.
1. As a type select *Web application*.
1. Add your extension's redirect URL (from Firefox build) into the Authorized origins input. You can get the correct redirect URL by calling `browser.identity.getRedirectURL()`. It will look like this: `https://a1b3223966f841b1a78844dc3ac27f75.extensions.allizom.org`
1. Add a callback URL from Supabase (Auth → Providers → Google) into the redirect URI field.

Note for configuring OAuth: If you request only name and email and no sensitive scopes you don't go through Google verification for your app.

However, if you upload the app logo you will be forced to go through the verification. This came by surprise and [I didn't initially know this was due to the app logo](https://twitter.com/pustelto/status/1778755202264469666).

### Connect Google auth to Supabase

1. Add the OAuth ID and Client secret to Supabase in the Providers section (use those from Firefox Credentials).
1. In the Authorized Client IDs field, you have to insert a comma-separated list of all of your client credentials IDs - one for the Chrome extension and one for the Firefox.
1. You also have to add redirect URLs to your Supabase project. Go to Authentication → URL Configuration and add both redirect URLs (for Chrome and Firefox). Please note that unbundled extensions during dev will have different redirect URLs than the production build.

## Email and password login

When using Supabase UI, email signup and login will work out of the box. You only have to configure redirect URLs in your project as we did for Google auth. So if you have finished the previous section you are good to go.

The problem will arise when a users need to reset a forgotten password. We have to make a few changes to our `Auth.tsx` component and background script to handle the click on the reset link.

The reset link will use redirect URLs, but it will contain one more parameter: `type=recovery` to help us recognize this is a password reset (Supabase adds this parameter automatically).

We will update our `tabs.onUpdated` listener in the background script to check for the presence of this param.

```diff-javascript
browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url?.startsWith(browser.identity.getRedirectURL())) {
+   const hashMap = parseUrlHash(changeInfo.url);
+
+   const redirectType = hashMap.get('type');
+   if (redirectType === 'recovery') {
+     browser.tabs.update({ url: getLoginPageUrl(hashMap) });
+     return;
+   }
    finishOAuthSignIn(changeInfo.url);
  }
});
```

If the param is present we will append it together with other params to the auth page URL and open it to finishe the password reset flow.

On the auth page we have to check if we have those params in the URL. If yes, there are a couple of things we have to do:

- Take access and refresh tokens from the URL and create a new session
- Change the `view` prop to `update_password` value in `<SupabaseAuth/>` component.
- Once the `USER_UPDATED` event is detected in `onAuthStateChanged` listener we will change the URL to remove the params. This will show a success confirmation message.  

```diff-tsx
export function Auth() {
+  // Get tab URL from the window object
+  const tabUrl = new URL(window.location.href);
+  const type = tabUrl.searchParams.get('type');
+  const access_token = tabUrl.searchParams.get('access_token');
+  const refresh_token = tabUrl.searchParams.get('refresh_token');

  const [session, setSession] = useState(null);

  useEffect(() => {
+    if (access_token && refresh_token) {
+      supabase.auth.setSession({ access_token, refresh_token });
+    } else {
+      supabase.auth.getSession().then(({ data: { session } }) => {
+        setSession(session);
+      });
+    }
-    supabase.auth.getSession().then(({ data: { session } }) => {
-      setSession(session);
-    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);

      if (session) {
        browser.runtime.sendMessage({ type: 'SET_AUTH', auth: session });
+
+        // Redirect to the auth page without the params to show the success message
+        if (event === 'USER_UPDATED') {
+          window.location.assign(`${tabUrl.origin}${tabUrl.pathname}`);
+        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div>
        <h1>Login</h1>
        <SupabaseAuth 
+         view={type === 'recovery' ? 'update_password' : undefined}
          supabaseClient={supabase}
          providers={['google']}
          queryParams={queryParams}
          redirectTo={browser.identity.getRedirectURL()}
        />
      </div>
    );
  } else {
    return (
      <div>
        <h1>Successfully logged in</h1>
        <p>You can now close this tab.</p>
      </div>
    );
  }
}
```

With this we have finished the Google/email password flows and our extension is ready to accept the users.

## Logout

Logout needs a few adjustments as well. We call `supabase.auth.signOut()` from the background script and clear all user data here. But if we try to login now our Auth page will look like the user is still logged in. The problem is that our Auth page, while part of the extension, is actually treated as different webpage - it has a different context and storage namespace in the browser.

So if we clear the session in the background script we still have access and refresh tokens available in the local storage on the Auth page. This is not good, as it prevents the user to login and can be a potential security issue.

I have decided to solve this by adding one more extra page, this time for logout. It just shows the message to the users that they have been logged out successfully. Once this page is opened we simply call `localStorage.clear()` to remove the user's data from here as well.

```tsx
const LogoutConfirmation = () => {
  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div>
      <h1>You have been logout from Clipio</h1>
      <p>You can now close this tab.</p>
    </div>
  );
};
```

## Session refreshing

The last thing we have to solve is session persistence and token refreshing. Background scripts can become inactive and any [global or in memory variables will be lost](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle#idle-shutdown). We have to persist the session in the extension's storage and refresh the token when needed.

For Clipio I refresh the token every time users open the extension and logout the user if the refresh method returns any error.

However, during development, I have encountered the issue that the refresh token has become invalid after some time. After a little digging, I have found out that the Supabase is refreshing the token after some time in the background script automatically as well, thus making my persisted refresh token invalid.

I have solved this issue by adding `onAuthStateChanged` listener to the background script and moved most of the persistence logic here:

```javascript
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
     browser.storage.local.set((session);
  }

  if (event === 'SIGNED_OUT') {
    browser.storage.local.clear();
  }
});
```

This will correctly handle all cases when refreshing of token and persist the tokens for the future.

## Conclusion

Implementing authentication in a browser extension without a traditional website took me more time than I thought. That's why I have summarize all the issues in this guide and I hope it will help others. 

If you have any questions or run into issues, feel free to reach out. And if you like this article, please share it on social media. Happy coding!
