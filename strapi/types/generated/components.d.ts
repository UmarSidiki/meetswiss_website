import type { Schema, Struct } from '@strapi/strapi';

export interface DynamicZoneAbout extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_about';
  info: {
    description: '';
    displayName: 'About';
    icon: 'information';
  };
  attributes: {
    button: Schema.Attribute.Component<'shared.button', false>;
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String;
    images: Schema.Attribute.Media<'images', true>;
  };
}

export interface DynamicZoneBrands extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_brands';
  info: {
    description: '';
    displayName: 'Brands';
    icon: 'bulletList';
  };
  attributes: {
    heading: Schema.Attribute.String;
    logos: Schema.Attribute.Relation<'oneToMany', 'api::logo.logo'>;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneCities extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_cities';
  info: {
    description: '';
    displayName: 'Cities';
    icon: 'pin';
  };
  attributes: {
    cities: Schema.Attribute.Relation<'oneToMany', 'api::transfer.transfer'>;
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.Text;
  };
}

export interface DynamicZoneCta extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_ctas';
  info: {
    description: '';
    displayName: 'CTA';
    icon: 'cursor';
  };
  attributes: {
    CTAs: Schema.Attribute.Component<'shared.button', true>;
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneFaq extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_faqs';
  info: {
    displayName: 'FAQ';
    icon: 'question';
  };
  attributes: {
    faqs: Schema.Attribute.Relation<'oneToMany', 'api::faq.faq'>;
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneFormNextToSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_form_next_to_sections';
  info: {
    description: '';
    displayName: 'Form_Next_To_Section';
    icon: 'book';
  };
  attributes: {
    form: Schema.Attribute.Component<'shared.form', false>;
    heading: Schema.Attribute.String;
    section: Schema.Attribute.Component<'shared.section', false>;
    social_media_icon_links: Schema.Attribute.Component<
      'shared.social-media-icon-links',
      true
    >;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneHero extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_heroes';
  info: {
    description: '';
    displayName: 'Hero';
    icon: 'layout';
  };
  attributes: {
    button: Schema.Attribute.Component<'shared.button', false>;
    eyebrow: Schema.Attribute.String;
    form_embed_html: Schema.Attribute.Text;
    slides: Schema.Attribute.Component<'shared.hero-slide', true>;
  };
}

export interface DynamicZoneHowItWorks extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_how_it_works';
  info: {
    description: '';
    displayName: 'How_It_Works';
    icon: 'question';
  };
  attributes: {
    heading: Schema.Attribute.String;
    steps: Schema.Attribute.Component<'shared.steps', true>;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneRelatedArticles extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_related_articles';
  info: {
    description: '';
    displayName: 'related_articles';
    icon: 'bulletList';
  };
  attributes: {
    articles: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
  };
}

export interface DynamicZoneStats extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_stats';
  info: {
    description: '';
    displayName: 'Stats';
    icon: 'chartPie';
  };
  attributes: {
    heading: Schema.Attribute.String;
    items: Schema.Attribute.Component<'shared.stat-item', true>;
  };
}

export interface DynamicZoneTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_testimonials';
  info: {
    description: '';
    displayName: 'Testimonials';
    icon: 'emotionHappy';
  };
  attributes: {
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
    testimonials: Schema.Attribute.Relation<
      'oneToMany',
      'api::testimonial.testimonial'
    >;
  };
}

export interface DynamicZoneWhyChooseUs extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_why_choose_us';
  info: {
    description: '';
    displayName: 'Why_Choose_Us';
    icon: 'shield';
  };
  attributes: {
    cards: Schema.Attribute.Component<'shared.why-card', true>;
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
  };
}

export interface GlobalFooter extends Struct.ComponentSchema {
  collectionName: 'components_global_footers';
  info: {
    description: '';
    displayName: 'Footer';
    icon: 'apps';
  };
  attributes: {
    contact_email: Schema.Attribute.Email;
    contact_phone: Schema.Attribute.String;
    contact_whatsapp: Schema.Attribute.String;
    copyright: Schema.Attribute.String;
    footer_columns: Schema.Attribute.Component<'global.footer-column', true>;
    social_media_links: Schema.Attribute.Component<'shared.link', true>;
    tagline: Schema.Attribute.Text;
  };
}

export interface GlobalFooterColumn extends Struct.ComponentSchema {
  collectionName: 'components_global_footer_columns';
  info: {
    description: 'A footer link column with a heading and list of links';
    displayName: 'Footer Column';
    icon: 'layout';
  };
  attributes: {
    heading: Schema.Attribute.String;
    links: Schema.Attribute.Component<'shared.link', true>;
  };
}

export interface GlobalNavbar extends Struct.ComponentSchema {
  collectionName: 'components_global_navbars';
  info: {
    displayName: 'Navbar';
    icon: 'bold';
  };
  attributes: {
    left_navbar_items: Schema.Attribute.Component<'shared.link', true>;
    phone: Schema.Attribute.String;
    right_navbar_items: Schema.Attribute.Component<'shared.link', true>;
    tagline: Schema.Attribute.String;
  };
}

export interface ItemsInput extends Struct.ComponentSchema {
  collectionName: 'components_items_inputs';
  info: {
    description: '';
    displayName: 'Input';
    icon: 'apps';
  };
  attributes: {
    name: Schema.Attribute.String;
    placeholder: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<
      [
        'text',
        'email',
        'password',
        'submit',
        'textarea',
        'button',
        'checkbox',
        'color',
        'date',
        'datetime-local',
        'file',
        'hidden',
        'image',
        'month',
        'number',
        'radio',
        'range',
        'reset',
        'search',
        'tel',
        'time',
        'url',
        'week',
      ]
    > &
      Schema.Attribute.DefaultTo<'text'>;
  };
}

export interface SharedButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_buttons';
  info: {
    description: '';
    displayName: 'Button';
    icon: 'cursor';
  };
  attributes: {
    target: Schema.Attribute.Enumeration<
      ['_blank', '_self', '_parent', '_top']
    >;
    text: Schema.Attribute.String;
    URL: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<
      ['simple', 'outline', 'primary', 'muted']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface SharedForm extends Struct.ComponentSchema {
  collectionName: 'components_shared_forms';
  info: {
    description: '';
    displayName: 'Form';
    icon: 'paperPlane';
  };
  attributes: {
    inputs: Schema.Attribute.Component<'items.input', true>;
  };
}

export interface SharedHeroSlide extends Struct.ComponentSchema {
  collectionName: 'components_shared_hero_slides';
  info: {
    description: '';
    displayName: 'Hero Slide';
    icon: 'landscape';
  };
  attributes: {
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    paragraph: Schema.Attribute.Text;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    target: Schema.Attribute.Enumeration<
      ['_blank', '_self', '_parent', '_top']
    >;
    text: Schema.Attribute.String;
    URL: Schema.Attribute.String;
  };
}

export interface SharedPerks extends Struct.ComponentSchema {
  collectionName: 'components_shared_perks';
  info: {
    description: '';
    displayName: 'Perks';
    icon: 'check';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface SharedSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_sections';
  info: {
    displayName: 'Section';
    icon: 'cursor';
  };
  attributes: {
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
    users: Schema.Attribute.Component<'shared.user', true>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 50;
      }>;
    metaImage: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    metaRobots: Schema.Attribute.String;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaViewport: Schema.Attribute.String;
    ogDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 250;
      }>;
    ogTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 95;
      }>;
    structuredData: Schema.Attribute.JSON;
    twitterDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 250;
      }>;
    twitterImage: Schema.Attribute.Media<'images'>;
    twitterTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 95;
      }>;
  };
}

export interface SharedSocialMediaIconLinks extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_media_icon_links';
  info: {
    description: '';
    displayName: 'Social_Media_Icon_Links';
    icon: 'expand';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    link: Schema.Attribute.Component<'shared.link', true>;
  };
}

export interface SharedStatItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_stat_items';
  info: {
    description: '';
    displayName: 'Stat_Item';
    icon: 'chartPie';
  };
  attributes: {
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface SharedSteps extends Struct.ComponentSchema {
  collectionName: 'components_shared_steps';
  info: {
    description: '';
    displayName: 'Steps';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedUser extends Struct.ComponentSchema {
  collectionName: 'components_shared_users';
  info: {
    description: '';
    displayName: 'user';
    icon: 'user';
  };
  attributes: {
    firstname: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    job: Schema.Attribute.String;
    lastname: Schema.Attribute.String;
  };
}

export interface SharedWhyCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_why_cards';
  info: {
    description: '';
    displayName: 'Why_Card';
    icon: 'check';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Enumeration<
      ['shield', 'money', 'car', 'clock', 'star', 'users', 'luggage', 'leaf']
    > &
      Schema.Attribute.DefaultTo<'shield'>;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'dynamic-zone.about': DynamicZoneAbout;
      'dynamic-zone.brands': DynamicZoneBrands;
      'dynamic-zone.cities': DynamicZoneCities;
      'dynamic-zone.cta': DynamicZoneCta;
      'dynamic-zone.faq': DynamicZoneFaq;
      'dynamic-zone.form-next-to-section': DynamicZoneFormNextToSection;
      'dynamic-zone.hero': DynamicZoneHero;
      'dynamic-zone.how-it-works': DynamicZoneHowItWorks;
      'dynamic-zone.related-articles': DynamicZoneRelatedArticles;
      'dynamic-zone.stats': DynamicZoneStats;
      'dynamic-zone.testimonials': DynamicZoneTestimonials;
      'dynamic-zone.why-choose-us': DynamicZoneWhyChooseUs;
      'global.footer': GlobalFooter;
      'global.footer-column': GlobalFooterColumn;
      'global.navbar': GlobalNavbar;
      'items.input': ItemsInput;
      'shared.button': SharedButton;
      'shared.form': SharedForm;
      'shared.hero-slide': SharedHeroSlide;
      'shared.link': SharedLink;
      'shared.perks': SharedPerks;
      'shared.section': SharedSection;
      'shared.seo': SharedSeo;
      'shared.social-media-icon-links': SharedSocialMediaIconLinks;
      'shared.stat-item': SharedStatItem;
      'shared.steps': SharedSteps;
      'shared.user': SharedUser;
      'shared.why-card': SharedWhyCard;
    }
  }
}
