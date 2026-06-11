const JSON_FILE_NAME = "agm_car_users.json";
let usersData = []; 


        
        function loadJsonFile() {
            const data = localStorage.getItem(JSON_FILE_NAME);
            if (data) {
                try {
                    usersData = JSON.parse(data);
                } catch (e) {
                    usersData = [];
                }
            } else {
                usersData = [];
            }
            return usersData;
        }

       

        function saveJsonFile(data) {
            usersData = data;
            localStorage.setItem(JSON_FILE_NAME, JSON.stringify(data, null, 2));
        }

        
        function exportJsonFile() {
            const dataStr = JSON.stringify(usersData, null, 2);
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = JSON_FILE_NAME;
            document.body.appendChild(a);
            a.click();

            a.remove();


            URL.revokeObjectURL(url);
            alert("Fichier " + JSON_FILE_NAME + " exporté avec succès !");
        }




       
        const authPage = document.getElementById("auth-page");
        const dashboardPage = document.getElementById("dashboard-page");
        const formLogin = document.getElementById("form-login");
        const formRegister = document.getElementById("form-register");
        const btnToggleAuth = document.getElementById("btn-toggle-auth");
        const toggleText = document.getElementById("toggle-text");
        const authTitle = document.getElementById("auth-title");
        const btnLogout = document.getElementById("btn-logout");
        const btnExportJson = document.getElementById("btn-export-json");
        const btnImportJson = document.getElementById("btn-import-json");
        const fileImport = document.getElementById("file-import");

        
        loadJsonFile();

        
        let isLogin = true;
        btnToggleAuth.addEventListener("click", () => {
            isLogin = !isLogin;
            if (isLogin) {
                formLogin.classList.remove("hidden");
                formRegister.classList.add("hidden");
                authTitle.textContent = "Se connecter";
                toggleText.textContent = "Pas encore de compte ?";
                btnToggleAuth.textContent = "S'inscrire";
            } else {
                formLogin.classList.add("hidden");
                formRegister.classList.remove("hidden");
                authTitle.textContent = "Créer un compte";
                toggleText.textContent = "Déjà un compte ?";
                btnToggleAuth.textContent = "Se connecter";
            }
        });

        
        formRegister.addEventListener("submit", (e) => {
            e.preventDefault();

            const password = document.getElementById("reg-password").value;
            const passwordConfirm = document.getElementById("reg-password-confirm").value;

            if (password !== passwordConfirm) {
                alert("Les mots de passe ne correspondent pas");
                return;
            }

            const email = document.getElementById("reg-email").value;

           
            const existingUser = usersData.find(u => u.email === email);
            if (existingUser) {
                alert("Cet email est déjà utilisé. Veuillez en choisir un autre.");
                return;
            }

            const newUser = {
                id: Date.now().toString(),
                nom: document.getElementById("reg-nom").value,
                prenom: document.getElementById("reg-prenom").value,
                email: email,
                password: password,
                createdAt: new Date().toISOString()
            };

           
            usersData.push(newUser);
            saveJsonFile(usersData);

            alert("Compte créé avec succès ! Données sauvegardées dans " + JSON_FILE_NAME);
            formRegister.reset();
            btnToggleAuth.click();
            document.getElementById("login-email").value = email;
        });

        
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;

            
            loadJsonFile();

            const user = usersData.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem("agm_car_current_user", JSON.stringify(user));
                showDashboard(user);
            } else {
                alert("Email ou mot de passe incorrect");
            }
        });

        
        function showDashboard(user) {
            authPage.classList.add("hidden");
            dashboardPage.classList.remove("hidden");
            document.getElementById("user-name").textContent = user.prenom + " " + user.nom;
            document.getElementById("user-email").textContent = user.email;
        }

        
        btnLogout.addEventListener("click", () => {
            localStorage.removeItem("agm_car_current_user");
            dashboardPage.classList.add("hidden");
            authPage.classList.remove("hidden");
            formLogin.reset();
        });

        
        btnExportJson.addEventListener("click", exportJsonFile);

        
        btnImportJson.addEventListener("click", () => {
            fileImport.click();
        });
        fileImport.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                importJsonFile(e.target.files[0]);
                e.target.value = "";
            }
        });

        
        (function init() {
            loadJsonFile();
            const currentUser = localStorage.getItem("agm_car_current_user");
            if (currentUser) {
                showDashboard(JSON.parse(currentUser));
            }
        })();
