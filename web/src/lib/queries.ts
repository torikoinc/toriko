// Tout le site en une requête : home + panneaux restau + sous-panneaux MENU / RECRUITMENT
// + panneaux ABOUT / RECRUITMENT / CONTACT (recrutement : tout dans siteSettings)
export const siteQuery = /* groq */ `{
  "settings": *[_id == "siteSettings"][0]{
    companyName, logo, seoDescription, ogImage,
    aboutImage, aboutCaption, aboutText, company,
    recruitmentIntro, recruitmentEmpty,
    "positions": positions[]{..., "restaurant": restaurant->{nameEn, nameJa, "slug": slug.current}},
    email, phone, address, contactText
  },

  "restaurants": *[_type == "restaurant" && visible != false] | order(order asc){
    _id, nameEn, nameJa, "slug": slug.current,
    postalCode, address, phone, hours, holidays,
    mapUrl, instagram, reservationUrl, description,
    color, accentColor, logo, images,
    menuImage, menu, menuNote
  }
}`
