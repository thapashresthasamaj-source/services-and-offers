# थापा श्रेष्ठ समाज — Thapa Shrestha Society website

Live at **https://thapashresthasociety.com/offers/**

**Club Card offers** (`/offers/`) is a static page that opens when someone scans the QR code on a Thapa Shrestha Samaj Club Card. It lists every service, discount and offer card holders can use.

No build tools and no server. It's plain HTML, CSS and JavaScript, hosted on **GitHub Pages** from the repository [thapashresthasamaj-source/services-and-offers](https://github.com/thapashresthasamaj-source/services-and-offers).

```
index.html                         home page: forwards to offers/ (replace later with a main society site)
offers/index.html                  Club Card offers page
offers/css/style.css               styles (logo colours: navy, red, orange)
offers/js/offers.js                ← EDIT THIS: contact info, categories, offers
offers/js/app.js                   search, filters, details popup
offers/assets/logo.png             society logo
offers/assets/logo-placeholder.svg fallback if logo.png is missing
.github/workflows/static.yml       publishes the site on every push to main
```

## Edit offers and contact details

Open `offers/js/offers.js`:

- **`SAMAJ`**: phone, email and Facebook link. Leave a field as `""` to hide it. When you've added real partners, set `showSampleNotice: false`.
- **`CATEGORIES`**: add or rename categories, with an icon and colour for each.
- **`OFFERS`**: add, remove or change offers. Copy an existing block and edit it. If you fill in `phone`, a **Call partner** button appears in the offer details.

Every offer in this file right now is **sample data**, including the business names.

## Preview locally

From this folder, run:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000/offers/.

## Publish changes

Push to `main`. The GitHub Actions workflow deploys the site in about a minute (see the **Actions** tab).

```bash
git pull --rebase
git add .
git commit -m "Update offers"
git push
```

## Custom domain

The domain `thapashresthasociety.com` is set in the repository's **Settings → Pages → Custom domain**, with **Enforce HTTPS** on. Its DNS is managed at KathmanduHost:

| Type  | Host  | Value                           |
|-------|-------|---------------------------------|
| A     | `@`   | `185.199.108.153`               |
| A     | `@`   | `185.199.109.153`               |
| A     | `@`   | `185.199.110.153`               |
| A     | `@`   | `185.199.111.153`               |
| CNAME | `www` | `thapashresthasamaj-source.github.io` |

Don't delete these records or remove the custom domain from GitHub. Doing either would break the QR code on every printed card.

## QR code on the card

Point the QR code at:

```
https://thapashresthasociety.com/offers/
```

**Optional:** add the card number to each card's QR link to greet that member, for example `https://thapashresthasociety.com/offers/?card=TSS-0001`. The page then shows "Club Card No. TSS-0001". It also shows a live ticking clock, so a partner can see the page is open right now and isn't a screenshot. This is only a display feature. A static site can't verify cards, so partners should still check the physical card.
