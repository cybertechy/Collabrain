"use client"
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

        username: {
          "usr_top": "Welcome! Let's Pick a Username",
          "usr_msg": "Choose a unique username to represent you on our platform. It's the first step in creating your personal profile!",
          "usr_type": "Enter your username",
          "usr_available": "Username is available",
          "usr_type_err": "Username must be at least 4 characters and alphanumeric (including underscores)",
          "usr_taken": "Username is taken",
          "checking": "Checking availability...",
          "usr_err": "Error checking availability",
          "upd_fail": "Failed to update username",
          "upd_error": "Error updating username",
          "sign_out_btn": "Sign out",
          "lets_go_btn": "Let's Go!"
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
          "name_error": "Folder name cannot be empty",
          "rename_button": "Rename",
          "new_folder_name": "New Folder Name",
          "rename_top": "Rename Folder",
          "cancel_button": "Cancel",
          "delete_button": "Delete",
          "delete_top": "Confirm Deletion",
          "delete_msg": "Are you sure you want to delete this folder and its contents?"
        },

        dashboard_project: {
          "rename_button": "Rename",
          "new_project_name": "New Project Name",
          "rename_top": "Rename Project",
          "cancel_button": "Cancel",
          "delete_button": "Delete",
          "delete_top": "Confirm Deletion",
          "delete_msg": "Are you sure you want to delete this folder and its contents?",
          "share_button": "Share",
          "organize_button": "Organize"
        },

        navbar: {
          "leaderboard": "Leaderboard",
          "notifications": "Notifications",
          "profile_set": "Profile Settings"
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

        notifications: {
          "invites": "Team Invites",
          "no_invites": "You have no team invites."
        },

        create_join_team: {
          "create_top": "Create a team",
          "create_desc": "Creating a team has never been simpler, you're only a few clicks away from your exclusive space.",
          "create_button": "Create a Team",
          "invite_q": "Have an invite already?",
          "join_button": "Join a Team"
        },

        create_team: {
          "create_top": "Customize your team",
          "create_msg": "Give your team a nice snazzy name and an icon.",
          "team_name": "Team Name",
          "enter_name": "Enter team name",
          "guidelines1": "By creating a team, you agree to Collabrain's ",
          "guidelines2": "Community Guidelines*",
          "back_button": "Back",
          "create_button": "Create",
          "public": "Public Team",
          "private": "Private Team"
        },

        join_team: {
          "join_top": "Join a team",
          "join_msg": "Enter the invite details to join an existing team.",
          "enter_link": "Enter invite link",
          "no_invite_q": "Don't have an invite?",
          "check_public": "Check out public teams in the discovery",
          "back_button": "Back",
          "join_button": "Join"
        },

        create_folder_overlay: {
          "folder_top": "Create a New Folder",
          "folder_name": "Enter folder name",
          "folder_clr": "Pick a color for your folder: ",
          "folder_cancel": "Cancel",
          "folder_create": "Create",
          "folder_wait": "Creating...",
          "folder_hover": "New Folder"
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
          "2fa_enable": "Enable",
          "2fa_enabled": "Enabled",
          "2fa_disable": "Disable",
          "2fa_disabled": "Disabled",
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
        },

        new_project: {
          "project_top": "Choose the type of project you would like to create",
          "map": "Content Map",
          "doc": "Document",
          "create_button": "Create Project"
        },

        dms: {
          "chats": "Chats",
          "search": "Search",
          "all": "This is where your friends can be found.",
          "received": "You will find your received friend requests here.",
          "blocked": "You will find your blocked users here.",
          "search_friends": "Start typing to search for friends to add.",
          "all_btn": "All",
          "received_btn": "Received",
          "blocked_btn": "Blocked",
          "search_users": "Search Users",
          "friend_settings": "Select an Option",
          "block": "Block User",
          "alias": "Set Alias",
          "confirm": "Confirm",
          "cancel": "Cancel"
        },

        my_profile: {
          "top": "Edit your information here",
          "bio": "Biography",
          "edu": "Education", 
          "school_name": "School name...",
          "degree": "Degree...", 
          "start_yr": "Start Year...",
          "end_yr": "End Year...",
          "lic_cert": "Licenses & Certifications",
          "cert_title": "Certification title...",
          "date_obt": "Date obtained...",
          "obt_on": "obtained on ",
          "teams": "Your Teams",
          "name_ent": "Enter your name",
          "email_ent": "Enter your updated email",
          "from": " from ",
          "your_bio": "Your biography here"
        },

        shared: {
          "shrd_projects": "Shared Projects",
          "no_projects": "No shared projects available.",
          "shared_top": "Shared with Me"
        },

        msg_box: {
          "enter_msg": "Enter a Message...",
          "files_attached": "file(s) attached"
        },

        content_map: {
          "msg1_title": "Bring ideas onto life",
          "msg1": "This is the content map, you can create diagrams and much more here",
          "msg2_title": "Content Map Name",
          "msg2": "You can edit the content map name by clicking on the icon",
          "msg3_title": "Share Content Map with others",
          "msg3": "You can share the current content map to others by clicking on it",
          "msg4_title": "Saved Status",
          "msg4": "This icon shows the saving status of the content map",
          "doneBtn": "Understood",
          "closeBtn": "Close",
          "nextBtn": "Next",
          "prevBtn": "Previous",
        },

        discover: {
          "top": "Discover Teams",
          "rank": "Rank",
          "name": "Name",
          "score": "Score",
          "actions": "Actions",
          "search": " Search team... ",
          "leave": "Leave",
          "joined": "Joined", 
          "join": "Join Team",
          "joined_teams": "Joined Teams",
          "no_joins": "No teams joined yet."
        },

        team: {
          "invite": "Invite People",
          "team_settings": "Team Settings",
          "del_team": "Delete Team",
          "leave_team": "Leave Team",
          "del_msg": "Are you sure you want to delete this team?",
          "yes": "Yes",
          "no": "No",
          "view_details": "View Team Details",
          "confirm_delete": "Confirm Delete",
          "delete_msg": "Are you sure you want to delete this team? THIS IS IRREVERSIBLE!",
          "cancel": "Cancel",
          "delete": "Delete",
          "banned": "Sorry, you are banned from this team",
          "channels": "Channels"
        },

        team_overview: {
          "desc": "Description",
          "leaderboard": "Leaderboard",
          "members": "Team Members",
          "points": "Points",
          "1st": "1st",
          "2nd": "2nd",
          "3rd": "3rd"
        },

        team_settings: {
          "general": "General",
          "roles": "Roles",
          "usr_mgmt": "User Management",
          "bans": "Bans",
          "server_name": "Server Name",
          "save": "Save", 
          "edit": "Edit",
          "name_success": "Team name updated successfully!",
          "img_success": "Team image updated successfully!",
          "img_error": "Error updating team image. Please try again.",
          "visib": "Server Visibility",
          "public": "Public",
          "private": "Private",
          "usr_kicked": "User kicked successfully",
          "ban_success": "User banned successfully", 
          "ban_error": "Error banning user. Please try again.",
          "roles": "Roles",
          "member": "Member",
          "admin": "Admin",
          "owner": "Owner",
          "kick": "Kick",
          "ban": "Ban",
          "unban": "Unban",
          "search": "Search Users"
        },

        create_channel: {
          "name": "Channel Name",
          "enter_name": "Enter channel name",
          "create": "Create",
          "cancel": "Cancel"  
        },

        invite_users: {
          "invite": "Invite",
          "inv_users": "Invite Users",
          "search": "Search Users",
          "done": "Done",
          "not_found": "No users found" 
        },

        msg_item: {
          "save": "Save", 
          "edit": "Edit Message",
          "delete_top": "Delete Message",
          "report": "Report Message",
          "report_btn": "Report",
          "report_rsn": "Please select a reason for reporting this message.",
          "select_policy": "Select a policy", 
          "spam": "Spam",          
          "graph_violence": "Graphic Violence",
          "priv_violation": "Privacy Violation",
          "hate_speech": "Hate Speech",
          "del_msg": "Are you sure you want to delete this message? This action cannot be undone.",
          "cancel": "Cancel",
          "delete": "Delete",
          "add_comments": "Please provide additional comments"
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

        username: {
          "usr_top": "Добро пожаловать! Выберите Свое Имя Пользователя",
          "usr_msg": "Выберите уникальное имя пользователя для использования на нашей платформе. Это первый шаг в создании вашего личного профиля!",
          "usr_type": "Введите имя пользователя",
          "usr_available": "Имя пользователя свободно!",
          "usr_type_err": "Имя пользователя должно состоять минимум из 4 символов (букв, цифр или подчеркиваний)",
          "usr_taken": "Имя пользователя занято",
          "checking": "Проверяем доступность...",
          "usr_err": "Ошибка при проверке доступности",
          "upd_fail": "Не получилось обновить имя пользователя",
          "upd_error": "Ошибка при обновлении имени пользователя",
          "sign_out_btn": "Выйти",
          "lets_go_btn": "Погнали!"
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

        navbar: {
          "leaderboard": "Доска Почета",
          "notifications": "Уведомления",
          "profile_set": "Настройки Профиля"
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

        notifications: {
          "invites": "Приглашения в Команды",
          "no_invites": "У вас нет приглашений в команды."
        },

        create_project: {

        },

        create_join_team: {
          "create_top": "Создать команду",
          "create_desc": "Создание команды очень простое занятие, которое создаст для вас простор воображения.",
          "create_button": "Создать Команду",
          "invite_q": "Есть приглашение?",
          "join_button": "Вступить в Команду"
        },

        create_team: {
          "create_top": "Персонализируйте вашу команду",
          "create_msg": "Дайте вашей команде прикольное имя и иконку.",
          "team_name": "Имя Команды",
          "enter_name": "Введите имя команды",
          "guidelines1": "Создавая команду, вы соглашаетесь с ",
          "guidelines2": "Правилами Сообщества Collabrain*",
          "back_button": "Назад",
          "create_button": "Создать",
          "public": "Открытая Команда",
          "private": "Закрытая Команда"
        },

        join_team: {
          "join_top": "Вступить в команду",
          "join_msg": "Введите данные приглашения, чтобы вступить в существующую команду.",
          "enter_link": "Введите ссылку приглашения",
          "no_invite_q": "Нет приглашения?",
          "check_public": "Найдите команды по вашим интересам",
          "back_button": "Назад",
          "join_button": "Вступить"
        },

        create_folder_overlay: {
          "name_error": "Имя папки не может быть пустым",
          "folder_top": "Создать Новую Папку",
          "folder_name": "Введите имя папки",
          "folder_clr": "Выберите цвет вашей папки : ",
          "folder_cancel": "Отмена",
          "folder_create": "Создать",
          "folder_wait": "Создание...",
          "folder_hover": "Новая Папка"
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
          "2fa_enable": "Включить",
          "2fa_enabled": "Включено",
          "2fa_disable": "Выключить",
          "2fa_disabled": "Выключено",
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
        },

        new_project: {
          "project_top": "Выберите тип проекта, который вы хотите создать",
          "map": "Контент Карта",
          "doc": "Документ",
          "create_button": "Создать Проект"
        },

        dms: {
          "chats": "Чаты",
          "search": "Поиск",
          "all": "Здесь вы можете найти своих друзей.",
          "received": "Здесь вы найдете запросы на дружбу.",
          "blocked": "Здесь вы найдете заблокированных пользователей.",
          "search_friends": "Начните печатать, чтобы найти и добавить друзей.",
          "all_btn": "Все",
          "received_btn": "Запросы",
          "blocked_btn": "Заблокированы",
          "search_users": "Поиск Друзей",
          "friend_settings": "Выберите Действие",
          "block": "Заблокировать пользователя",
          "alias": "Дать Прозвище",
          "confirm": "Подтвердить",
          "cancel": "Отмена"
        },

        my_profile: {
          "top": "Измените информацию о себе,",
          "bio": "Обо мне",
          "edu": "Образование", 
          "school_name": "Название учебного заведения...",
          "degree": "Степень...", 
          "start_yr": "Год начала...",
          "end_yr": "Год конца...",
          "lic_cert": "Лицензии и Сертификаты",
          "cert_title": "Назв. сертификата...",
          "date_obt": "Дата получения...",
          "obt_on": "получен ",
          "teams": "Ваши Команды",
          "name_ent": "Введите свое имя",
          "email_ent": "Введите новую почту",
          "from": " получен в ",
          "your_bio": "Здесь будет ваша биография"
        },

        shared: {
          "shrd_projects": "Общие Проекты",
          "no_projects": "У вас нет общих проектов.",
          "shared_top": "Общие Файлы"
        },

        msg_box: {
          "enter_msg": "Введите сообщение...",
          "files_attached": "файл(а/ов) прикреплен(о/ы)",
        },

        content_map: {
          "msg1_title": "Воплощайте идеи в жизнь",
          "msg1": "Это контент карта, здесь вы можете создавать диаграмы, и многое другое",
          "msg2_title": "Имя Контент Карты",
          "msg2": "Вы можете изменять название контент карты, кликнув на иконку",
          "msg3_title": "Делитесь Контент Картой с другими",
          "msg3": "Кликнув на контент карту, вы сможете поделиться ею с другими",
          "msg4_title": "Статус Сохранения",
          "msg4": "Эта иконка показывает статус сохранения контент карты",
          "doneBtn": "Понял",
          "closeBtn": "Закрыть",
          "nextBtn": "Вперед",
          "prevBtn": "Назад",
        },

        discover: {
          "top": "Найти Команды",
          "rank": "Место",
          "name": "Название",
          "score": "Кол-во очков",
          "actions": "Действия",
          "search": " Найдите команду... ",
          "leave": "Покинуть",
          "joined": "Вы уже в команде", 
          "join": "Присоединиться",
          "joined_teams": "Я уже участник",
          "no_joins": "Вы не состоите ни в одной команде."
        },

        team: {
          "invite": "Пригласить Людей",
          "team_settings": "Настройки Команды",
          "del_team": "Удалить Команду",
          "leave_team": "Покинуть Команду",
          "del_msg": "Вы уверены, что хотите удалить эту команду?",
          "yes": "Да",
          "no": "Нет",
          "view_details": "Подробности Команды",
          "confirm_delete": "Подтвердите Удаление",
          "delete_msg": "Вы уверены, что хотите удалить эту команду? ДАННОЕ ДЕЙСТВИЕ НЕОБРАТИМО!",
          "cancel": "Отмена",
          "delete": "Удалить",
          "banned": "Извините, вы заблокированы в этой команде",
          "channels": "Каналы"
        },

        team_overview: {
          "desc": "Описание",
          "leaderboard": "Доска Почета",
          "members": "Члены Команды",
          "points": "Очков",
          "1st": "1-ый",
          "2nd": "2-ой",
          "3rd": "3-ий"
        },

        team_settings: {
          "general": "Общие",
          "roles": "Роли",
          "usr_mgmt": "Управление",
          "bans": "Блокировка",
          "server_name": "Имя Сервера",
          "save": "Сохранить", 
          "edit": "Изменить",
          "name_success": "Team name updated successfully!",
          "img_success": "Team image updated successfully!",
          "img_error": "Error updating team image. Please try again.",
          "visib": "Видимость Сервера",
          "public": "Открытый",
          "private": "Закрытый",
          "usr_kicked": "User kicked successfully",
          "ban_success": "User banned successfully", 
          "ban_error": "Error banning user. Please try again.",
          "roles": "Роли",
          "member": "Член",
          "admin": "Админ",
          "owner": "Владелец",
          "kick": "Выгнать",
          "ban": "Заблокировать",
          "unban": "Разблокировать",
          "search": "Поиск Пользователей"
        },

        create_channel: {
          "name": "Имя Канала",
          "enter_name": "Введите имя канала",
          "create": "Создать",
          "cancel": "Отмена"  
        },

        invite_users: {
          "invite": "Пригласить",
          "inv_users": "Пригласить Пользователей",
          "search": "Поиск Пользователей",
          "done": "Готово",
          "not_found": "Пользователь не найден" 
        },

        msg_item: {
          "save": "Сохранить", 
          "edit": "Изменить",
          "delete": "Удалить",
          "report": "Пожаловаться",
          "report_btn": "Пожаловаться",
          "report_rsn": "Пожалуйста, укажите причину жалобы",
          "select_policy": "Выберите нарушение", 
          "spam": "Спам",          
          "graph_violence": "Сцены Насилия",
          "priv_violation": "Нарушение Конфиденц.",
          "hate_speech": "Разжиг. ненависти",
          "del_msg": "Вы уверены что хотите удалить это сообщение? Данное действие необратимо.",
          "cancel": "Отмена",
          "delete": "Удалить",
          "add_comments": "Пожалуйста, опишите ситуацию"
        }
      },
      // Add more languages here
    },
    detection: {
        order: ['querystring', 'cookie', 'localStorage', 'htmlTag', 'path', 'subdomain'],
        caches: ['cookie'], // Cache the detected language in cookies
    },
    fallbackLng: "en", // Use "en" if detected lng is not available
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
  });

export default i18n;