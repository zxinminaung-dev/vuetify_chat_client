<template>
  <v-container fluid>
    <v-dialog v-model="dialog" persistent width="auto">
      <v-card>
        <v-card-text>
          <v-progress-circular
            indeterminate
            color="amber"
          ></v-progress-circular>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-card variant="flat" color="blue-lighten-5">
      <v-card-text>
        {{ this.socket.selectedProject.Name }}
      </v-card-text>
    </v-card>
    <v-card variant="flat" color="blue-lighten-5" class="mt-3">
      <v-btn
        prepend-icon="mdi-plus-circle-outline"
        variant="text"
        color="success"
        @click="cardModuleForm = !cardModuleForm"
      >
        Modules
      </v-btn>
    </v-card>
    <v-card
      v-if="cardModuleForm"
      class="mx-auto mt-2"
      subtitle="New Module"
      style="max-height: 100px"
    >
      <v-card-text class="bg-surface-light mt-n2">
        <v-form>
          <v-row cols="12" class="mb-n3" style="max-height: 80px">
            <v-col cols="12" md="3" class="mt-n1">
              <v-text-field
                v-model="socket.selectedProject.Name"
                label="Project Name"
                :disabled="true"
                variant="underlined"
                density="compact"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3" class="mt-n1">
              <v-text-field
                v-model="module.Name"
                label="Module Name"
                variant="underlined"
                density="compact"
              ></v-text-field>
              <!-- <v-autocomplete
                density="compact"
                required
                chips
                closable-chips
                variant="underlined"
                label="assigne"
                :items="socket.teamMembers"
                item-title="Name"
                item-value="Id"
              >
              <template v-slot:chip="{ props, item }">
                <v-chip
                  v-bind="props"
                  :text="item.Name"
                ></v-chip>
              </template>
              </v-autocomplete> -->
            </v-col>
            <v-col cols="12" md="4" class="mt-n1">
              <v-btn
                append-icon="mdi-arrow-left-bottom"
                class="mt-2 mr-2"
                density="compact"
                variant="tonal"
                color="success"
              >
                Save
              </v-btn>
              <v-btn
                append-icon="mdi-close"
                class="mt-2"
                density="compact"
                variant="tonal"
                color="warning"
                @click="CancelModule()"
              >
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script>
import { socket } from "@/store/socket";
import Message from "../models/message.model";
import Module from "../models/module.model";
export default {
  data() {
    return {
      socket: socket(),
      text: "",
      message: new Message(),
      selectFile: false,
      imageString: "",
      cardHeight: 0,
      dialog: false,
      cardModuleForm: false,
      module: new Module(),
    };
  },
  created() {
    console.log(this.socket.teamMembers);
  },
  watch: {
    "socket.selectedProject"(val) {
      if(val){
        
        this.cardModuleForm = false;
      }
    },
  },
  created() {},
  methods: {
    CancelModule(){
      this.module.Name = "";
      this.cardModuleForm = !this.cardModuleForm
    }
  },
  mounted() {
    window.addEventListener("resize", this.updateDeviceWidth);
  },
  updated() {},
  beforeMount() {},
};
</script>

<style>
#scrollable {
  display: flex;
  flex-direction: column-reverse;
  overflow-y: scroll;
  height: 300px;
}
</style>
