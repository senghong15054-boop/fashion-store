import { createContext, useContext, useMemo, useState } from "react";

const translations = {
  en: {
    nav: {
      home: "Home",
      shop: "Shop",
      contact: "Contact",
      account: "My Account",
      register: "Register",
      admin: "Admin"
    },
    common: {
      continueShopping: "Continue shopping",
      needHelp: "Need help?",
      contact: "Contact",
      shop: "Shop",
      cart: "Cart",
      checkout: "Checkout",
      account: "Account",
      loading: "Loading...",
      previous: "Previous",
      next: "Next",
      remove: "Remove",
      summary: "Summary",
      subtotal: "Subtotal",
      shipping: "Shipping",
      calculatedInCheckout: "Calculated in checkout"
    },
    home: {
      badge: "New season essentials",
      title: "Premium T-shirts with a sharper digital storefront.",
      description:
        "A polished e-commerce experience with refined product storytelling, KHQR checkout, and an admin system that keeps operations under control.",
      shopCollection: "Shop collection",
      contactTeam: "Contact the team",
      featuredLabel: "Featured products",
      featuredTitle: "Designed for a premium first impression.",
      viewAll: "View all",
      studioPick: "Studio pick",
      studioTitle: "Made to feel expensive.",
      studioDescription:
        "Product pages, cart flow, and admin operations are built to feel deliberate, not generic."
    },
    contact: {
      label: "Contact",
      title: "Support that feels direct and human.",
      description:
        "Use the direct channels below for order questions, delivery follow-up, or product advice.",
      telegram: "Telegram",
      facebook: "Facebook",
      phone: "Phone"
    },
    checkout: {
      label: "Checkout",
      title: "Complete your payment",
      abaTitle: "ABA KHQR",
      abaDescription:
        "Scan the QR, complete the transfer, then upload your payment screenshot for manual verification.",
      accountName: "Account name",
      openPaymentLink: "Open ABA payment link",
      instructionsTitle: "Payment instructions",
      steps: [
        "Open your ABA mobile app and scan the KHQR code.",
        "Or tap the payment button above to open the ABA payment page directly.",
        "Transfer the exact total shown on this checkout page.",
        "Take a clear screenshot after payment is successful.",
        "Upload the screenshot before placing your order."
      ],
      amountToPay: "Amount to pay",
      payExactAmount: "Pay this exact amount, then upload the payment screenshot.",
      screenshotLabel: "Upload payment screenshot",
      placeOrder: "Place order",
      processing: "Processing...",
      screenshotRequired: "Please upload your payment screenshot before placing the order."
    },
    success: {
      label: "Order received",
      title: "Thank you for your order.",
      description:
        "Your payment screenshot will be reviewed manually. Order reference:"
    },
    account: {
      title: "Create your customer account.",
      description:
        "Register to speed up checkout and keep your customer details ready for future orders.",
      register: "Register",
      login: "Login",
      createAccount: "Create account",
      creating: "Creating account...",
      signingIn: "Signing in...",
      welcome: "Welcome back,"
    },
    shopPage: {
      title: "Shop collection",
      search: "Search premium tee...",
      all: "All",
      page: "Page"
    },
    productPage: {
      selectColor: "Select color",
      selectedColor: "Selected color",
      selectSize: "Select size",
      addToCart: "Add to cart",
      buyNow: "Buy now",
      stockAvailable: "Stock available"
    },
    cartPage: {
      title: "Review your order",
      empty: "Your cart is empty.",
      browse: "Browse products",
      continueToCheckout: "Continue to checkout"
    }
  },
  km: {
    nav: {
      home: "ទំព័រដើម",
      shop: "ហាង",
      contact: "ទំនាក់ទំនង",
      account: "គណនីរបស់ខ្ញុំ",
      register: "ចុះឈ្មោះ",
      admin: "គ្រប់គ្រង"
    },
    common: {
      continueShopping: "បន្តទិញទំនិញ",
      needHelp: "ត្រូវការជំនួយ?",
      contact: "ទំនាក់ទំនង",
      shop: "ហាង",
      cart: "កន្ត្រក",
      checkout: "បង់ប្រាក់",
      account: "គណនី",
      loading: "កំពុងផ្ទុក...",
      previous: "ថយក្រោយ",
      next: "បន្ទាប់",
      remove: "លុប",
      summary: "សរុប",
      subtotal: "តម្លៃសរុប",
      shipping: "ការដឹកជញ្ជូន",
      calculatedInCheckout: "គណនានៅពេលបង់ប្រាក់"
    },
    home: {
      badge: "សម្លៀកបំពាក់រដូវថ្មី",
      title: "អាវយឺតគុណភាពខ្ពស់ ជាមួយគេហទំព័រលក់ទំនិញទំនើប។",
      description:
        "បទពិសោធន៍លក់ទំនិញអនឡាញដ៏ស្អាតជាមួយការបង្ហាញផលិតផលយ៉ាងល្អ ការទូទាត់ KHQR និងប្រព័ន្ធគ្រប់គ្រងដែលមានសណ្តាប់ធ្នាប់។",
      shopCollection: "ទិញទំនិញ",
      contactTeam: "ទាក់ទងក្រុមការងារ",
      featuredLabel: "ផលិតផលពិសេស",
      featuredTitle: "រចនាឡើងសម្រាប់ចំណាប់អារម្មណ៍ដំបូងដ៏ល្អ។",
      viewAll: "មើលទាំងអស់",
      studioPick: "ជម្រើសពិសេស",
      studioTitle: "រចនាឡើងឲ្យមានអារម្មណ៍ថាលំដាប់ខ្ពស់។",
      studioDescription:
        "ទំព័រផលិតផល កន្ត្រក និងប្រព័ន្ធគ្រប់គ្រងត្រូវបានរចនាឡើងយ៉ាងប្រុងប្រយ័ត្ន។"
    },
    contact: {
      label: "ទំនាក់ទំនង",
      title: "ការគាំទ្រដែលផ្ទាល់ និងមានភាពជាមនុស្ស។",
      description:
        "ប្រើបណ្តាញខាងក្រោមសម្រាប់សំណួរអំពីការបញ្ជាទិញ ការដឹកជញ្ជូន ឬការណែនាំផលិតផល។",
      telegram: "តេឡេក្រាម",
      facebook: "ហ្វេសប៊ុក",
      phone: "ទូរស័ព្ទ"
    },
    checkout: {
      label: "បង់ប្រាក់",
      title: "បំពេញការទូទាត់របស់អ្នក",
      abaTitle: "ABA KHQR",
      abaDescription:
        "ស្កេន QR បញ្ចប់ការទូទាត់ ហើយបង្ហោះរូបថតបង្កាន់ដៃសម្រាប់ការផ្ទៀងផ្ទាត់។",
      accountName: "ឈ្មោះគណនី",
      openPaymentLink: "បើកតំណទូទាត់ ABA",
      instructionsTitle: "វិធីបង់ប្រាក់",
      steps: [
        "បើកកម្មវិធី ABA ហើយស្កេន KHQR។",
        "ឬចុចប៊ូតុងខាងលើដើម្បីបើកទំព័រទូទាត់ ABA ដោយផ្ទាល់។",
        "ផ្ទេរប្រាក់តាមចំនួនសរុបដែលបង្ហាញនៅទំព័របង់ប្រាក់នេះ។",
        "ថតរូបអេក្រង់បន្ទាប់ពីបង់ប្រាក់ជោគជ័យ។",
        "បង្ហោះរូបភាពមុនពេលបញ្ជូនការបញ្ជាទិញ។"
      ],
      amountToPay: "ចំនួនត្រូវបង់",
      payExactAmount: "សូមបង់ចំនួននេះឲ្យត្រឹមត្រូវ ហើយបង្ហោះរូបភាពការទូទាត់។",
      screenshotLabel: "បង្ហោះរូបភាពការទូទាត់",
      placeOrder: "បញ្ជូនការបញ្ជាទិញ",
      processing: "កំពុងដំណើរការ...",
      screenshotRequired: "សូមបង្ហោះរូបភាពការទូទាត់មុនពេលបញ្ជូនការបញ្ជាទិញ។"
    },
    success: {
      label: "ទទួលបានការបញ្ជាទិញ",
      title: "សូមអរគុណសម្រាប់ការបញ្ជាទិញ។",
      description:
        "រូបភាពការទូទាត់របស់អ្នកនឹងត្រូវបានពិនិត្យដោយដៃ។ លេខយោងការបញ្ជាទិញ៖"
    },
    account: {
      title: "បង្កើតគណនីអតិថិជនរបស់អ្នក។",
      description:
        "ចុះឈ្មោះដើម្បីបំពេញការបង់ប្រាក់បានលឿន និងរក្សាទុកព័ត៌មានសម្រាប់ការបញ្ជាទិញលើកក្រោយ។",
      register: "ចុះឈ្មោះ",
      login: "ចូលគណនី",
      createAccount: "បង្កើតគណនី",
      creating: "កំពុងបង្កើត...",
      signingIn: "កំពុងចូល...",
      welcome: "ស្វាគមន៍ត្រលប់មកវិញ,"
    },
    shopPage: {
      title: "ទិញទំនិញ",
      search: "ស្វែងរកអាវយឺត...",
      all: "ទាំងអស់",
      page: "ទំព័រ"
    },
    productPage: {
      selectColor: "ជ្រើសរើសពណ៌",
      selectedColor: "ពណ៌ដែលបានជ្រើស",
      selectSize: "ជ្រើសរើសទំហំ",
      addToCart: "បញ្ចូលកន្ត្រក",
      buyNow: "ទិញឥឡូវ",
      stockAvailable: "ចំនួនស្តុក"
    },
    cartPage: {
      title: "ពិនិត្យការបញ្ជាទិញរបស់អ្នក",
      empty: "កន្ត្រករបស់អ្នកទទេ។",
      browse: "មើលផលិតផល",
      continueToCheckout: "បន្តទៅបង់ប្រាក់"
    }
  }
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem("premium-language") || "en");

  const value = useMemo(
    () => ({
      language,
      setLanguage: (next) => {
        setLanguage(next);
        localStorage.setItem("premium-language", next);
      },
      t: translations[language]
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
