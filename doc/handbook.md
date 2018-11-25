* main.js       # entry point
    * App.js    # 用 router switch 來決定頁面
        - SetUserInfo
        - Header
            + GlobalSearch
            + NavBar
            + TopBar
        - Progress.Component  # 上方 progress bar
        - Notifications
        * routeUser       # 登入可使用
            + SideNav     # 側邊欄 (只有登入才出現)
                - DogTag
                - LinkFormat
            + RoomPage (CRUD)
                - TableList     [list]
                    - Table
                        - DataFrameTable
                - [detail]
                - []
                - Form          [create]
                    - FormGroups
                - [edit]
                
            + RoomTime
                - 甘特圖
            + RoleSelection
                - 下拉式選單
            + CoursePage
                - CourseList
                - CourseDetail
                    - CustomJumbotron
                    - ListView
                    - FormButtons
                - CourseIntro
                - SectionList
                    - TableList
            + RoomPage
                - TableList
            + JobPage
                - JobList
            + UserPage
                - Profile
            + StaticPage

        * routeGuest
            + IndexPage
                - SectionTitle
                - Thumbnails
            + IntroPage
                - 
            + ContactPage
            + AuthPage
                - Login
                    - SectionTitle
                    - MyoauthButton
                - Signup
                    - Form
                        - FormGroups
                        - FormButtons
                - Password   << 應該改成 PasswordForgot
            + StaticPage
        - Footer
            - FooterTop
            - FooterMid
            - FooterBottom
        - Dialog

        + OfflinePage  # 當 offline 時才會啟動
        (route 跟 offline 三選一)

## 待做項目
* 用 saga 實作 api 介接
* 