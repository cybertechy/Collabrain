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
          "login_desc": "You are now one step away from accessing the world of collaboration and productivity.",
          "reg_top": "Create Your Collabrain Account",
          "forgot_password": "Forgot your password?",
          "login_button": "Log In",
          "or": "OR",
          "make_acc_q": "Need an account?",
          "have_acc_q": "Already have an account?",
          "sign_up": "SIGN UP",
          "email": "Email ID",
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
          "rclick_msg": "Right click to make your first project!",
          "new_folder_rclick": "New Folder",
          "new_map_rclick": "New Map",
          "new_doc_rclick": "New Document",
          "my_brain": "My Brain",
        },

        dashboard_folder: {
          "rename_button": "Rename",
          "new_folder_name": "New Folder Name",
          "rename_top": "Rename Folder",
          "cancel_button": "Cancel",
          "delete_button": "Delete",
          "delete_top": "Confirm Delete",
          "delete_msg": "Are you sure you want to delete this folder and its contents?"
        },

        dashboard_project: {
          "rename_button": "Rename",
          "new_folder_name": "New Project Name",
          "rename_top": "Rename Project",
          "cancel_button": "Cancel",
          "delete_button": "Delete",
          "delete_top": "Confirm Delete",
          "delete_msg": "Are you sure you want to delete this folder and its contents?",
          "share_button": "Share",
          "organize_button": "Organize"
        },

        sidebar: {
          "my_brain": "My Brain",
          "shared_with_me": "Shared with Me",
          "dms": "Direct Messages",
          "new_project": "New Project",
          "new_team": "New Team",
          "teams_disc": "Discover Teams"
        },

        leaderboard: {
          "leaderboard": "League Leaderboard",
          "view_more": "View More",
          "view_less": "View Less"
        },

        create_folder_overlay: {
          "folder_top": "Create a New Folder",
          "folder_name": "Enter folder name",
          "folder_clr": "Pick a color for your folder: ",
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
        },

        profile_overlay: {
          "view_profile": "View your Profile",
          "pass_auth": "Password and Authentication",
          "change_pass": "Change Password",
          "2fa": "Two-factor Authentication",
          "2fa_desc": "Protect your Collabrain account with an extra layer of security.",
          "2fa_button": "Enable",
          "remove_acc": "Account Removal",
          "remove_acc_desc": "Disabling your account means you can recover it at any time after taking this action",
          "delete_button": "Delete",
          "delete_msg": "Are you sure you want to delete your account? This action cannot be undone.",
          "confirm_button": "Confirm",
          "signout": "Sign Out",
          "cancel": "Cancel"
        },

        general_overlay: {
          "appearance": "Change Appearance",
          "lang": "Language",
          "lang_menu": "Select your language",
          "strikes": "Bad behavior strikes",
          "strike_num": "out of 3",
          "arabic": "Arabic",
          "english_us": "English (US)",
          "russian": "Russian"
        },

        sound_overlay: {
          "speaker_header": "Speaker Device",
          "mic_header": "Microphone",
          "speaker_menu": "Default Speaker",
          "mic_menu": "Default Microphone",
          "speaker_ext": "External Speakers",
          "speaker_other": "Choose other option",
          "mic_built_in": "Built-in Microphone",
          "mic_other": "Choose other option",
        },

        privacy_overlay: {
          "dnd": "Do not disturb",
          "export_data": "Export my data",
          "export_button": "Export",
          "delete_data": "Delete my data",
          "delete_button": "Delete"
        },
        
        notif_overlay: {
          "notif_source": "Receive Notifications from",
          "sound_toggle": "Notification Sound",
          "sound_type": "Choose Notification Sound",
          "config_button": "Configure",
          "notif_type": "Select an option",
          "notif_everywhere": "Everywhere",
          "notif_other": "Choose other Option"
        },

        access_overlay: {
          "tts": "Text-to-speech (TTS)",
          "font_size": "Font-size",
          "colorblind": "Colorblind Filters",
          "config": "Configure"
        }
      },
      ru: {
        login_signup: {
          "login_top": "Вход в Collabrain",
          "login_desc": "Вы находитесь в одном шаге от доступа к миру совместной работы и продуктивности.",
          "reg_top": "Создайте Аккаунт в Collabrain",
          "forgot_password": "Забыли пароль?",
          "login_button": "Вход",
          "or": "ИЛИ",
          "make_acc_q": "У вас еще нет аккаунта?",
          "have_acc_q": "У вас уже есть аккаунт?",
          "sign_up": "РЕГИСТРАЦИЯ",
          "email": "Адрес эл. почты",
          "password": "Пароль",
          "fname": "Имя",
          "lname": "Фамилия",
          "confirm_pass": "Подтверд. пароль",
          "create_acc": "Создать Аккаунт",
          "email_invalid": "Неверный адрес эл. почты",
          "pass_mismatch": "Введенные пароли не совпадают друг с другом.",
          "pass_req": "Пароль должен состоять из минимум 8 символов, включая заглавные и прописные буквы, а также цифры."

        },

        dashboard: {
          "sort_by": "Сорт. По",
          "sort_name": "Имя",
          "sort_date": "Дата измен.",
          "folders": "Папки",
          "projects": "Проекты",
          "rclick_msg": "Нажмите правую кнопку мыши, чтобы создать свой первый проект!",
          "new_folder_rclick": "Новая Папка",
          "new_map_rclick": "Новая Карта",
          "new_doc_rclick": "Новый Документ",
          "my_brain": "Мой Мозг"
        },

        dashboard_folder: {
          "rename_button": "Переименовать",
          "new_folder_name": "Новое Имя Папки",
          "rename_top": "Переименовать Папку",
          "cancel_button": "Отмена",
          "delete_button": "Удалить",
          "delete_top": "Подтвердите Удаление",
          "delete_msg": "Вы уверены, что хотите удалить эту папку, и ее содержимое?"
        },

        dashboard_project: {
          "rename_button": "Переименовать",
          "new_project_name": "Новое Имя Проекта",
          "rename_top": "Переименовать Проект",
          "cancel_button": "Отмена",
          "delete_button": "Удалить",
          "delete_top": "Подтвердите Удаление",
          "delete_msg": "Вы уверены, что хотите удалить этот проект, и его содержимое?",
          "share_button": "Поделиться",
          "organize_button": "Организовать"
        },

        sidebar: {
          "my_brain": "Мой Мозг",
          "shared_with_me": "Общие Файлы",
          "dms": "Сообщения",
          "new_project": "Новый Проект",
          "new_team": "Новая Команда",
          "teams_disc": "Найти Команды"
        },

        leaderboard: {
          "leaderboard": "Доска Почета",
          "view_more": "Развернуть",
          "view_less": "Свернуть"
        },

        create_folder_overlay: {
          "folder_top": "Создать Новую Папку",
          "folder_name": "Введите имя папки",
          "folder_clr": "Выберите цвет вашей папки: ",
          "folder_cancel": "Отмена",
          "folder_create": "Создать",
          "folder_wait": "Создание..."
        },

        settings: {
          "settings_top": "Настройки",
          "profile_side": "Профиль",
          "general_side": "Основные",
          "sound_side": "Звук",
          "privacy_side": "Конфиденц.",
          "notif_side": "Уведомления",
          "access_side": "Специальные Возможности",
        },

        profile_overlay: {
          "view_profile": "Мой Профиль",
          "pass_auth": "Пароль и Настройки Входа",
          "change_pass": "Смена Пароля",
          "2fa": "Двухэтапная Аутентификация",
          "2fa_desc": "Защитите свой аккаунт Collabrain дополнительным слоем защиты.",
          "2fa_button": "Включить",
          "remove_acc": "Удаление Аккаунта",
          "remove_acc_desc": "После удаления аккаунта, вы сможете восстановить его в будущем.",
          "delete_button": "Удалить",
          "delete_msg": "Вы уверены, что хотите удалить свой аккаунт?",
          "confirm_button": "Да",
          "signout": "Выйти",
          "cancel": "Отмена",
          "dlt_confirm_msg": "Удаление Аккаунта"
        },

        general_overlay: {
          "appearance": "Изменить Внешний Вид",
          "lang": "Язык",
          "lang_menu": "Выберите язык",
          "strikes": "Баллы плохого поведения",
          "strike_num": "из 3",
          "arabic": "Арабский",
          "english_us": "Английский(США)",
          "russian": "Русский"
        },

        sound_overlay: {
          "speaker_header": "Выбор Динамиков",
          "mic_header": "Выбор Микрофона",
          "speaker_menu": "Устр. по-умолчанию",
          "mic_menu": "Устр. по-умолчанию",
          "speaker_ext": "Внешние Динамики",
          "speaker_other": "Выбрать др. устройство",
          "mic_built_in": "Встр. Микрофон",
          "mic_other": "Выбрать др. устройство"
        },

        privacy_overlay: {
          "dnd": "Не беспокоить",
          "export_data": "Скачать мои данные",
          "export_button": "Скачать",
          "delete_data": "Удалить мои данные",
          "delete_button": "Удалить"
        },
        
        notif_overlay: {
          "notif_source": "Получать уведомления",
          "sound_toggle": "Звук Уведомлений",
          "sound_type": "Выберите Звук Уведомлений",
          "config": "Настроить",
          "notif_type": "Выберите вариант",
          "notif_everywhere": "Везде",
          "notif_other": "Другие варианты"
        },

        access_overlay: {
          "tts": "Озвучивание текста",
          "font_size": "Размер шрифта",
          "colorblind": "Фильтры для дальтоников",
          "config": "Настроить"
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