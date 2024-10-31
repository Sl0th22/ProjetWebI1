<template>
    <div class="login-container">
        <div class="login-box">
            <h2><strong>Login</strong></h2>
            <p v-if="!resetPassword">
                <input type="text" v-model="log" placeholder="Username">
                <input type="password" v-model="pssw" placeholder="Password">
                <button @click="Verif(log, pssw)">Login</button>
                <button @click="Reset">Reset Password</button>
            </p>

            <div v-if="resetPassword">
                <h3>Reset Password</h3>
                <input type="text" v-model="resetLog" placeholder="Username">
                <input type="password" v-model="oldPssw" placeholder="Old Password">
                <input type="password" v-model="newPssw" placeholder="New Password">
                <button @click="ResetPassword">Reset Password</button>
                <button @click="CancelReset">Cancel</button>
            </div>

            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            <p v-if="successMessage" class="success">{{ successMessage }}</p>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      logs: ["log1", "log2", "log3"],
      psswds: ["passw1", "passw2", "passwd3"],
      log: "",
      pssw: "",
      resetLog: "",
      oldPssw: "",
      newPssw: "",
      errorMessage: "",
      successMessage: "",
      resetPassword: false, 
    };
  },
  methods: {
    Verif(log, pssw) {
      const logIndex = this.logs.indexOf(log);
      if (logIndex !== -1 && this.psswds[logIndex] === pssw) {
        this.successMessage = "Connexion succeed ! wait...";
        this.errorMessage = "";
        setTimeout(() => {
        this.$router.push('/Team');
      }, 2000);
      } else {
        this.errorMessage = "User name or password incorrect.";
        this.successMessage = "";
      }
    },
    Reset() {
      this.resetPassword = true;
      this.errorMessage = "";
      this.successMessage = "";
    },
    CancelReset() {
      this.resetPassword = false;
      this.resetLog = "";
      this.oldPssw = "";
      this.newPssw = "";
    },
    ResetPassword() {
      const logIndex = this.logs.indexOf(this.resetLog);
      if (logIndex !== -1 && this.psswds[logIndex] === this.oldPssw) {
        this.psswds[logIndex] = this.newPssw;
        this.successMessage = "Password changed successly !";
        this.errorMessage = "";
        this.CancelReset();
      } else {
        this.errorMessage = "User name or password incorrect.";
        this.successMessage = "";
      }
    }
  }
}
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #f0f2f5, #d9e2ec);
}

.login-box {
    background: white;
    padding: 2rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    text-align: center;
    font-family: Arial, sans-serif;
}

.login-box h2 {
    margin-bottom: 1rem;
    font-size: 24px;
    color: #333;
}

.login-box h3 {
    margin-top: 1rem;
    font-size: 20px;
    color: #333;
}

.login-box input {
    width: 100%;
    padding: 0.75rem;
    margin: 0.5rem 0;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    box-sizing: border-box;
}

.login-box input:focus {
    outline: none;
    border-color: #3f8efc;
    box-shadow: 0 0 5px rgba(63, 142, 252, 0.2);
}

.login-box button {
    width: 100%;
    padding: 0.75rem;
    margin-top: 1rem;
    background-color: #3f8efc;
    border: none;
    border-radius: 6px;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;
}

.login-box button:hover {
    background-color: #3465d9;
}

.error {
    color: red;
    margin-top: 1rem;
}

.success {
    color: green;
    margin-top: 1rem;
}
</style>
