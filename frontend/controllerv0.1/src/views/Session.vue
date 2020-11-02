<template> 
<v-main>
<v-app-bar color="blue" dark app>
      <v-icon large>mdi-chevron-left</v-icon>
      <v-toolbar-title
        ><span>Sessions</span>
        
        </v-toolbar-title
      >
      <v-spacer></v-spacer>
        <span class="px-3">{{ "Session 1" }}</span>
    </v-app-bar>
<v-container class="fill-height">
    <v-row align="center" justify="center">
        <v-col cols="4">
            <v-card width="100%" max-height="400px" class="overflow-y-auto">
            <v-list >
                <v-subheader>Session 1</v-subheader>
                <v-list-item-group>
                    <v-list-item>
                        <v-list-item-icon>
                            <v-icon>mdi-account-tie</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            Page enseignant
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
                <v-divider></v-divider>
                <v-list-item-group>
                    <v-list-item v-for="std in students" :key="std.id" :to="makeLink(std.id)">
                        <v-list-item-icon>
                            <v-icon>mdi-school</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            {{std.id}}
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
            </v-card>
        </v-col>
    </v-row>
</v-container>
</v-main>
</template>

<script>
export default {
    data() {
        return {
            students: [{id: "MOV1"}, {id: "MOV3"}, {id: "MOV4"}, {id: "MOV6"}, {id: "MOV7"}, {id: "MOV8"}, {id: "MOV12"}, {id: "MOV13"}]
        }
    },
    methods: {
        makeLink(id) {
            return {path: '/student-recap', params: {id: id}}
        }
    }
}
</script>