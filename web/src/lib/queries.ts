// Tout le site en une requête : home + panneaux restau + sous-panneaux MENU / RECRUITMENT
// + panneaux ABOUT / RECRUITMENT (global) / CONTACT
export const siteQuery = /* groq */ `{
  "settings": *[_id == "siteSettings"][0]{
    companyName, logo, seoDescription, ogImage,
    aboutImage, aboutCaption, aboutText, company,
    recruitmentIntro, recruitmentEmpty,
    email, phone, address, contactText
  },

  "restaurants": *[_type == "restaurant" && visible != false] | order(order asc){
    _id, nameEn, nameJa, "slug": slug.current,
    postalCode, address, phone, hours, holidays,
    mapUrl, instagram, reservationUrl, description,
    color, accentColor, logo, images,
    menuImage, menu, menuNote,
    recruitmentOpen,
    "positions": select(recruitmentOpen == true => positions, [])
  },

  // RECRUITMENT global = tous les postes ouverts, groupés par restau
  "recruitment": *[_type == "restaurant" && visible != false && recruitmentOpen == true && count(positions) > 0]
    | order(order asc){
      nameEn, nameJa, "slug": slug.current, color, accentColor, positions
    }
}`
