export const login = {
  data() {
    return {
      img: 1,
      parent: null,
    };
  },

  mounted() {
    this.img = this.randomIntFromInterval(1, 7);
    this.parent = this.$root; 
  },

  methods: {
    randomIntFromInterval(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },

    async login() {
      if (!this.parent || !this.parent.formData) return;

      try {
        const data = this.parent.toFormData(this.parent.formData);
        const response = await axios.post(`${this.parent.url}/site/login`, data);

        if (response.data.error) {
          this.$refs.msg.alertFun(response.data.error);
          return;
        }

        if (response.data.user) {
          this.parent.user = response.data.user;
          window.localStorage.setItem("user", JSON.stringify(this.parent.user));

          // Исправлено! Используем this.$router.push вместо self.parent.page
          this.$router.push("/campaigns");
        }
      } catch (error) {
        console.error("Login error:", error);
      }
    },
  },

  template: `
      <div class="flex">
    <msg ref="msg"></msg>

    <div id="right-area">
        <img v-if="parent && parent.url" :src="parent.url + '/app/views/images/Cover_' + img + '.jpg'" alt="Background Image" />
    </div>

    <div id="left-area">
        <div class="header-container">
        <div class="al">
                <h1>Affiliate Sign in</h1>
            </div>
            <div class="logo">
                <img :src="parent.url + '/app/views/images/logo.svg'" alt="Logo">
            </div>
            
        </div>

        <div class="inner-form">
            <form @submit.prevent="login()" v-if="parent.formData">
                <div class="row">
                    <label for="email">Email</label>
                    <input type="email" v-model="parent.formData.email" id="email" required />
                </div>
                <div class="row">
                    <label for="password">Password</label>
                    <input type="password" v-model="parent.formData.password" id="password" required autocomplete="on" />
                </div>
                <div class="row">
                    <button class="btn" type="submit">Sign in</button>
                </div>
            </form>
        </div>
    </div>

    <div class="alertMsg" v-if="alert">
        <div class="wrapper al">
            <i class="fas fa-times-circle"></i> {{ alert }}
        </div>
    </div>
    <div class="successMsg" v-if="success">
        <div class="wrapper al">
            <i class="fas fa-check-circle"></i> {{ success }}
        </div>
    </div>
</div>
  `,
};
