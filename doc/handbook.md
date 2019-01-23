* main.js       [entry_point]
    * App       [用router_switch來決定頁面]
        - SetUserInfo
        - Header
            + GlobalSearch
            + NavBar
            + TopBar
        - Footer
            + FooterTop
            + FooterMid
            + FooterBottom
    * RouteUser             [登入可使用]
        + SideNav           [側邊欄(只有登入才出現)]
            - DogTag
            - LinkFormat
        + RoomPage          [CRUD] [/user/classroom-manage]
            1. TableList
                - Table
                    - DataFrameTable
            2. 
            3. Form
                - FormGroups
            4. 
        + RoomTime          [教室時間] [/user/classroom-time]
            - CommonPageContent
                - Overlay
                    - Popover
                - Modal
                - ButtonToolbar
                - EventCalendar
        + RolePage          [下拉式選單選角色] [/user/role-select]
            - Form
                - FormGroups
                - FormButtons
        + CoursePage        [CRUD] [/user/ongoing-course]
            1. CommonPageContent
                - Link x 2
                - TableList
            2. CourseDetail
                - CustomJumbotron
                - ListView
                - FormButtons
            3. CourseIntro
            4. SectionList
                - TableList
        + RoomPage          [CRUD]
            1. CommonPageContent
                - TableList
            2. 
            3. 
            4. 
        + JobPage
            - CommonPageContent
                - DataFrame
                    - obj.data.map...
                        - thumb.service.map...
            - Profile
        + StaticPage        [404]

    * RouteGuest
        + AuthPage          [登入註冊ㄜ]
            - Login
                - SectionTitle
                - MyoauthButton
                    - PopWindow
            - Signup
                - Form
                    - FormGroups
                    - FormButtons
            - Password      [!_應該改成PasswordForgot]
        + ContactPage
            - models.contactPage.info01.map...
            - models.contactPage.info02.map...
        + IndexPage
            - SectionTitle
            - Thumbnails
        + IntroPage
        + StaticPage



    + OfflinePage       [當offline時才會啟動]



## 共用系列

* 元件
    - CommonPageContent: 左上角標題
    - DataFrame: 共用列表空狀態 & loading
    - Progress.Component: 上方progress_bar
    - Notifications: 
    - Dialog

* Forms
    - globalSearch  [搜尋課程]
    - classroom     [教室]
    - courseCon     []
    - courseVM
    - profile
    - role
* 登入驗證
    - SetUserInfo 
    > retrieveUser  []
    > 
* 登入流程
    - MyoauthButton > 跳轉回課程列表
    - 只要到 RouteUser 改 isLogin 就可以進入測試狀態
    - 


## 待做項目
* 用 saga 實作 api 介接
* 


## 角色切換
* 在 reducer/Auth.js 的 substituation


## 進行中
* 切換視角
    - 由 Auth 底下的 substituation 決定
* cron job 格式轉換
* 教室時間對應
    - 要先得知 cron job 的週期
    - 然後再各自加一天計算
* 要分來源獲取課程
    - 有點忘記是否藥




