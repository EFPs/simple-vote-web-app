<template>
  <div v-if="dataAIndex !== -1 && resultAIndex !== -1">

    <v-container id="con" fluid align-center justify-center fill-height grid-list-sm>
      <v-layout row wrap align-center justify-center fill-height >
        <v-flex class="headline text-xs-center pa-5" xs12>
          {{displayStatus}}
        </v-flex>

        <v-flex>
          <v-layout xs12 sm12 column wrap align-space-around justify-center fill-height >

            <v-flex xs12 sm12>
              <v-layout row wrap align-center justify-center fill-height >
                <v-flex xs8 sm5>
                  <v-text-field
                      :disabled="voteData[dataStatusIndex]['.value']"
                      v-model="dataForm.a"
                      label="Choice A"
                  ></v-text-field>
                </v-flex>
                <v-flex v-if="voteData[dataStatusIndex]['.value']" xs2 sm1>
                  {{percentA}}%
                </v-flex>
                <v-flex v-if="voteData[dataStatusIndex]['.value']" xs2 sm1>
                  ({{voteResult[resultAIndex]['.value']}})
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs12 sm12>
              <v-layout row wrap align-center justify-center fill-height >
                <v-flex xs8 sm5>
                  <v-text-field
                      :disabled="voteData[dataStatusIndex]['.value']"
                      v-model="dataForm.b"
                      label="Choice B"
                  ></v-text-field>
                </v-flex>

                <v-flex v-if="voteData[dataStatusIndex]['.value']" xs2 sm1>
                  {{percentB}}%
                </v-flex>
                <v-flex v-if="voteData[dataStatusIndex]['.value']" xs2 sm1>
                  ({{voteResult[resultBIndex]['.value']}})
                </v-flex>
              </v-layout>
            </v-flex>


          </v-layout>
        </v-flex>

      </v-layout>
    </v-container>
    <v-btn @click="resetVote" dark color="red" :disabled="!voteData[dataStatusIndex]['.value']">RESET</v-btn>
    <v-btn @click="createVote" dark large color="blue" :disabled="voteData[dataStatusIndex]['.value']">create</v-btn>
    <v-btn @click="endVote" dark color="green" :disabled="voteData[dataClosedIndex]['.value']">END vote</v-btn>
  </div>
  <div v-else>
    Fetching information from the server..
  </div>
</template>

<script>
  import {db} from '../firebase';

  export default {
    name: "admin",
    data(){
      return{
        resultAIndex: -1,
        resultBIndex: -1,
        resultTotalIndex: -1,
        dataAIndex: -1,
        dataBIndex: -1,
        dataStatusIndex: -1,
        dataClosedIndex: -1,
        voteData: {},
        voteResult: {},
        displayStatus: '',
        percentA: -1,
        percentB: -1,
        dataForm:{
          a: "",
          b: "",
          closed: false,
          status: true,
        },
        resultForm:{
          a: 0,
          b: 0,
          total: 0,
        },
        dataFormReset:{
          a: "",
          b: "",
          closed: true,
          status: false,
        },
        resultFormReset:{
          a: 0,
          b: 0,
          total: 0,
        },

      }
    },
    firebase: function () {
      return {
        voteData: {
          source: db.ref('data')
        },
        voteResult: {
          source: db.ref('result')
        },
      }
    },
    watch:{
      voteData(){
        if(this.voteData[0] === undefined){
          return
        }
        this.getAllDataIndex()

        this.dataForm.a = this.voteData[this.dataAIndex]['.value']
        this.dataForm.b = this.voteData[this.dataBIndex]['.value']
        this.dataForm.status = this.voteData[this.dataStatusIndex]['.value']
        this.dataForm.closed = this.voteData[this.dataClosedIndex]['.value']

        if(this.dataForm.status){
          if(this.dataForm.closed){
            this.displayStatus = "Vote Has Been Closed"
          }else{
            this.displayStatus = "Vote In Process"
          }
        }else{
          this.displayStatus = "Awaiting Admin Creation"
        }

      },
      voteResult(){
        if(this.voteResult[0] === undefined){
          return
        }
        this.getAllResultIndex()

        this.resultForm.a = this.voteResult[this.resultAIndex]['.value']
        this.resultForm.b = this.voteResult[this.resultBIndex]['.value']
        this.resultForm.total = this.voteResult[this.resultTotalIndex]['.value']

        this.getPercent()
      }
    },
    methods:{
      createVote() {
        console.log("Create vote ",this.dataForm)
        this.dataForm.status = true
        this.dataForm.closed = false
        this.$firebaseRefs.voteData.set(this.dataForm);
        this.$firebaseRefs.voteResult.set(this.resultFormReset);
      },
      endVote(){
        this.$firebaseRefs.voteData.child('closed').set(true);
      },
      resetVote(){
        this.$firebaseRefs.voteData.set(this.dataFormReset);
        this.$firebaseRefs.voteResult.set(this.resultFormReset);
      },
      getAllResultIndex(){
        this.resultAIndex = this.voteResult.findIndex(x => x['.key']==='a');
        this.resultBIndex = this.voteResult.findIndex(x => x['.key']==='b');
        this.resultTotalIndex = this.voteResult.findIndex(x => x['.key']==='total');
      },
      getAllDataIndex(){
        this.dataAIndex = this.voteData.findIndex(x => x['.key']==='a');
        this.dataBIndex = this.voteData.findIndex(x => x['.key']==='b');
        this.dataStatusIndex = this.voteData.findIndex(x => x['.key']==='status');
        this.dataClosedIndex = this.voteData.findIndex(x => x['.key']==='closed');
      },
      getPercent(){
        const a = this.resultForm.a
        const b = this.resultForm.b
        const total = this.resultForm.total
        // console.log(a,b, total)
        // console.log(((a/total)*100))
        this.percentA = Math.round((a/total)*100)
        this.percentB = Math.abs(100 - this.percentA)
        if(isNaN(this.percentA)){
          this.percentA = 0
        }
        if(isNaN(this.percentB)){
          this.percentB = 0
        }
      }
    },
    mounted(){
      console.log(this.$route.params.pass)
      if (this.$route.params.pass !== 'pass'){
        this.$router.push('/');
      }
    }
  }
</script>

<style scoped>


  #con{
    min-height: 400px;
  }

</style>