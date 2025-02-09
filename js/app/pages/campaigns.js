export const campaigns = {
  inject: ["Sparent"],

  data: function () {
    return {
      parent: this.Sparent,
      data: {},
      details: {},
      date: "",
      date2: "",
      q: "",
      sort: "",
      loader: 1,
      id: 0,
      type: 0,
      all: true,
      active: false 
    }
  },

  mounted: function () {
    console.log("Объект parent:", this.parent);

    if (!this.parent.user) {
      this.parent.logout();
    }

    this.get();
    this.GetFirstAndLastDate();
  },
  
  methods: {
    GetFirstAndLastDate: function () {
      var year = new Date().getFullYear();
      var month = new Date().getMonth();
      var firstDayOfMonth = new Date(year, month, 2);
      var lastDayOfMonth = new Date(year, month + 1, 1);

      this.date = firstDayOfMonth.toISOString().substring(0, 10);
      this.date2 = lastDayOfMonth.toISOString().substring(0, 10);
    },

    get: function () {
      var self = this;
      var data = self.parent.toFormData(self.parent.formData);

      if (this.date !== "") data.append("date", this.date);
      if (this.date2 !== "") data.append("date2", this.date2);

      self.loader = 1;

      axios
        .post(this.parent.url + "/site/getCampaigns?auth=" + this.parent.user.auth, data).then(function (response) {
          console.log("Response data:", response.data);
          self.data = response.data;
          self.loader = 0;
        }).catch(function (error) {
          self.parent.logout();
        });
    },

    action: function () {
      var self = this;
      self.parent.formData.copy = "";

      var data = self.parent.toFormData(self.parent.formData);

      axios
        .post(this.parent.url + "/site/actionCampaign?auth=" + this.parent.user.auth, data).then(function (response) {
          self.$refs.new.active = 0;

          if (self.parent.formData.id) {
            self.$refs.header.$refs.msg.successFun("Successfully updated campaign!");
          } else {
            self.$refs.header.$refs.msg.successFun("Successfully added new campaign!");
          }

          self.get();
        }).catch(function (error) {
          console.log("errors: ", error);
        });
    },

    del: async function () {
      if (await this.$refs.header.$refs.msg.confirmFun("Please confirm next action", "Do you want to delete this campaign?")) {
        var self = this;
        var data = self.parent.toFormData(self.parent.formData);

        axios.post(this.parent.url + "/site/deleteCampaign?auth=" + this.parent.user.auth, data).then(function (response) {
          if (response.data.error) {
            self.$refs.header.$refs.msg.alertFun(response.data.error);
            return;
          } else {
            self.$refs.header.$refs.msg.successFun("Successfully deleted campaign!");
            self.get();
          }
        })
        .catch(function (error) {
          console.log("errors: ", error);
        });
      }
    },

    logout: function() {
      this.parent.logout();
    },

    toggleActive: function() {
      this.active = !this.active;
    }
  },

  template: `
<div class="campaigns-page">
    <div class="inside-content">

        <header class="header">
            <div id="user-top" @click="toggleActive()">
                <div id="user-circle">{{ parent.user.user[0] }}</div>
                <div id="user-info" :class="{ active: active }">
                    <a href="#" @click.prevent="logout()">
                        <i class="fas fa-sign-out-alt"></i> Log out
                    </a>
                </div>
            </div>
            <nav class="menu">
                <ul>
                    <li>
                        <router-link to="/users" :class="{ 'router-link-active': $route.path.includes('user') }">
                            <i class="fas fa-user"></i> Users
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/campaigns" :class="{ 'router-link-active': $route.path.includes('campaign') }">
                            <i class="fas fa-bullhorn"></i> Campaigns
                        </router-link>
                    </li>
                </ul>
            </nav>

            
            <div class="logo">
                <img src="/app/views/images/logo.svg" alt="Logo">
            </div>

        </header>

        <div class="header-center">
            <div class="date-picker-container">
                <input type="date" v-model="date" @change="get()" />
                <input type="date" v-model="date2" @change="get()" />
            </div>
            <h1>Campaigns</h1>
        </div>

        <div class="ptb20">
            <a class="btnS" href="#" @click.prevent="parent.formData={};$refs.new.active=1">
                <i class="fas fa-plus"></i> New
            </a>
        </div>

        <div class="wrapper">
            <div class="table" v-if="data.items.length">
                <table>
                    <thead>
                        <tr>
                            <th class="actions">Actions</th>
                            <th>Fraud Clicks</th>
                            <th>Leads</th>
                            <th>Clicks</th>
                            <th>Views</th>
                            <th>Title</th>
                            <th>#</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, i) in data.items" :key="i">
                            <td class="actions">
                                <a href="#" @click.prevent="parent.formData = item; del();">[X]</a>
                            </td>
                            <td>
                                <a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 4)">
                                    {{ item.fclicks || 0 }}
                                </a>
                            </td>
                            <td>
                                <a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 3)">
                                    {{ item.leads || 0 }}
                                </a>
                            </td>
                            <td>
                                <a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 1)">
                                    {{ item.clicks || 0 }}
                                </a>
                            </td>
                            <td>
                                <a href="#" @click.prevent="$refs.details.active=1; getDetails(item.id, 2)">
                                    {{ item.views || 0 }}
                                </a>
                            </td>
                            <td>
                                <router-link :to="'/campaign/' + item.id">
                                    {{ item.title }}
                                </router-link>
                            </td>
                            <td>{{ item.id }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="empty" v-if="!data.items.length">No items</div>
        </div>

    </div>
</div>


  `,
};
