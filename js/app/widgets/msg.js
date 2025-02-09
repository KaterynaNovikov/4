export const msg = {
  data() {
    return {
      alert: "",
      success: "",
      confirmTitle: "Please confirm next action",
      confirm: "",
      code: 0,
      interval: "",
      t1: null,
      t2: null,
    };
  },

  mounted() {
    this.parent = this.$root; 
  },

  methods: {
    fadeIn(el, timeout, display) {
      el.style.opacity = 0;
      el.style.display = display || "block";
      el.style.transition = `opacity ${timeout}ms`;

      setTimeout(() => {
        el.style.opacity = 1;
      }, 10);
    },

    fadeOut(el, timeout) {
      el.style.opacity = 1;
      el.style.transition = `opacity ${timeout}ms`;
      el.style.opacity = 0;

      setTimeout(() => {
        el.style.display = "none";
      }, timeout);
    },

    successFun(msg) {
      this.success = msg;
      clearTimeout(this.t1);
      clearTimeout(this.t2);

      this.t1 = setTimeout(() => {
        const block = document.querySelector(".successMsg");
        if (block) this.fadeIn(block, 1000, "flex");

        this.t2 = setTimeout(() => {
          if (block) this.fadeOut(block, 1000);
        }, 3000);
      }, 100);
    },

    alertFun(msg) {
      this.alert = msg;
      clearTimeout(this.t1);
      clearTimeout(this.t2);

      this.t1 = setTimeout(() => {
        const block = document.querySelector(".alertMsg");
        if (block) this.fadeIn(block, 1000, "flex");

        this.t2 = setTimeout(() => {
          if (block) this.fadeOut(block, 1000);
        }, 3000);
      }, 100);
    },
    confirmFun(title, text) {
      this.code = 0;
      var self = this;
    
      return new Promise(function (resolve) {
        self.confirmTitle = title;
        self.confirm = text;
        self.$refs.confirm.active = 1;
        self.interval = setInterval(function () {
          if (self.code > 0) resolve();
         },100);
      }).then(function(){
        clearInterval(self.interval);
            self.$refs.confirm.active = 0;
            if(self.code==1){
              return true;
            }
            if(self.code==2){
              return false;
            }
      });
    }      
  },

  template: `
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
    <popup ref="confirm" :title="confirmTitle">
  <div class="al">
    <i class="fas fa-info-circle"></i> {{ confirm }}
    <div class="botBtns">
      <a class="btnS" href="#" @click.prevent="code = 1">Yes</a>
      <a class="btnS" href="#" @click.prevent="code = 2">No</a>
    </div>
  </div>
</popup>
  `,
};
