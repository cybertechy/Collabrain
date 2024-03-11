import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .use(LanguageDetector) // Enables browser language detection
  .init({
    resources: {
      en: {
        login_signup: {
          "login_top": "Log into Collabrain",
          "reg_top": "Create Your Collabrain Account",
          "forgot_password": "Forgot your password?",
          "login_button": "Log In",
          "make_acc_q": "Need an account?",
          "have_acc_q": "Already have an account?",
          "sign_up": "SIGN UP",
          "email": "Email Address",
          "password": "Password",
          "fname": "First Name",
          "lname": "Last Name",
          "confirm_pass": "Confirm Password",
          "create_acc": "Create Account",
          "email_invalid": "Invalid email address",
          "pass_mismatch": "Password and Confirm Password are not the same",
          "pass_req": "Password must contain at least 8 characters including uppercase letters, lowercase letters, and numbers."
        },

        dashboard: {
          "sort_by": "Sort By",
          "sort_name": "Name",
          "sort_date": "Date Modified",
          "folders": "Folders",
          "projects": "Projects",
          "rclick_msg": "Right click to make your first project!"
        },

        leaderboard: {
          "leaderboard": "League Leaderboard",
          "view_more": "View More",
          "view_less": "View Less"
        },

        folder_overlay: {
          "folder_top": "Create a New Folder",
          "folder_name": "Enter folder name",
          "folder_color": "Pick a color for your folder: ",
          "folder_cancel": "Cancel",
          "folder_create": "Create",
          "folder_wait": "Creating..."
        },

        settings: {
          "settings_top": "Settings",
          "profile_side": "Profile",
          "general_side": "General",
          "sound_side": "Sound",
          "privacy_side": "Privacy",
          "notif_side": "Notifications",
          "access_side": "Accessibility",
          "view_profile": "View your Profile",
          "pass_auth": "Password and Authentication",
          "change_pass": "Change Password",
          "2fa": "Two-factor Authentication",
          "2fa_desc": "Protect your Collabrain account with an extra layer of security.",
          "2fa_button": "Enable",
          "remove_acc": "Account Removal",
          "remove_acc_desc": "Disabling your account means you can recover it at any time after taking this action",
          "delete_button": "Delete",
          "signout_button": "Sign Out"
        }
      },
      ru: {
        login_signup: {
          "login_top": "Вход в Collabrain",
          "reg_top": "Создайте Аккаунт в Collabrain",
          "forgot_password": "Забыли пароль?",
          "login_button": "Вход",
          "make_acc_q": "У вас еще нет аккаунта?",
          "have_acc_q": "У вас уже есть аккаунт?",
          "sign_up": "РЕГИСТРАЦИЯ",
          "email": "Адрес эл. почты",
          "password": "Пароль",
          "fname": "Имя",
          "lname": "Фамилия",
          "confirm_pass": "Подтвердите пароль",
          "create_acc": "Создать Аккаунт",
          "email_invalid": "Неверный адрес эл. почты",
          "pass_mismatch": "Введенные пароли не совпадают друг с другом",
          "pass_req": "Пароль должен состоять из минимум 8 символов, включая заглавные и прописные буквы, а также цифры."
        },

        dashboard: {
          "sort_by": "Сорт. По",
          "sort_name": "Имени",
          "sort_date": "Дате измен.",
          "folders": "Папки",
          "projects": "Проекты",
          "rclick_msg": "Нажмите правую кнопку мыши, чтобы создать свой первый проект!"
        },

        leaderboard: {
          "leaderboard": "Доска Почета",
          "view_more": "Развернуть",
          "view_less": "Свернуть"
        },

        folder_overlay: {
          "folder_top": "Создать Новую Папку",
          "folder_name": "Введите имя папки",
          "folder_clr": "Выберите цвет вашей папки: ",
          "folder_cancel": "Отмена",
          "folder_create": "Создать",
          "folder_wait": "Создание..."
        },

        settings: {
          "settings_top": "Настройки",
          "view_profile": "Ваш Профиль",
          "pass_auth": "Пароль и Вход",
          "change_pass": "Поменять Пароль",
          "2fa": "Двухфакторная Аутентификация",
          "2fa_desc": "Защитите ваш аккаунт Collabrain с дополнительным слоем защиты",
          "2fa_button": "Включить",
          "remove_acc": "Удаление аккаунта",
          "remove_acc_desc": "Выключив свой аккаунт, вы сможете снова включить его в будущем",
          "delete_button": "Удалить",
          "signout_button": "Выйти"
        }
      },
      // Add more languages here
    },
    detection: {
        order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
        caches: ['cookie'], // Cache the detected language in cookies
    },
    fallbackLng: "en", // Use "en" if detected lng is not available
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
  });

export default i18n;