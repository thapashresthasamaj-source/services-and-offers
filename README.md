# थापा श्रेष्ठ समाज — Club Card Benefits

A static website that opens when someone scans the QR code on a **Thapa Shrestha Samaj** Club Card. It lists every service, discount and offer card holders can use.

No build tools and no server. It's plain HTML, CSS and JavaScript, ready for **GitHub Pages**.

```
index.html                  page layout
css/style.css               styles (logo colours: navy, red, orange)
js/offers.js                ← EDIT THIS: contact info, categories, offers
js/app.js                   search, filters, details popup
assets/logo.png             ← ADD YOUR LOGO HERE
assets/logo-placeholder.svg shown until logo.png exists
```

## 1. Add the logo

Save the society logo as **`assets/logo.png`** (a square PNG, ideally 512×512 or larger). The site uses it in the header, the hero section, the favicon and link previews.

## 2. Edit offers and contact details

Open `js/offers.js`:

- **`SAMAJ`**: phone, email and Facebook link. Leave a field as `""` to hide it. When you've added real partners, set `showSampleNotice: false`.
- **`CATEGORIES`**: add or rename categories, with an icon and colour for each.
- **`OFFERS`**: add, remove or change offers. Copy an existing block and edit it. If you fill in `phone`, a **Call partner** button appears in the offer details.

Every offer in this file right now is **sample data**, including the business names.

## 3. Preview locally

Open `index.html` in a browser, or run:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## 4. Publish on GitHub Pages

1. Create a new GitHub repository, for example `tss-club-card`.
2. Push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "Club card benefits website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/tss-club-card.git
   git push -u origin main
   ```
3. On GitHub, go to **Settings → Pages → Build and deployment**. Choose **Deploy from a branch**, then branch `main` and folder `/ (root)`, and save.
4. After a minute or two the site is live at `https://<your-username>.github.io/tss-club-card/`.

## 5. QR code on the card

Point the QR code at the GitHub Pages URL.

**Optional:** add the card number to each card's QR link to greet that member:

```
https://<your-username>.github.io/tss-club-card/?card=TSS-0001
```

The page then shows "Club Card No. TSS-0001". It also shows a live ticking clock, so a partner can see the page is open right now and isn't a screenshot. This is only a display feature. A static site can't verify cards, so partners should still check the physical card.
