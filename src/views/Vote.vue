<template>

  <div v-if="dataAIndex === -1 && resultAIndex === -1">
    Fetching data from server..
  </div>
  <div v-else-if="dataForm.status">

    <v-container id="con" fluid align-center justify-center fill-height grid-list-sm>
      <v-layout row wrap align-center justify-center fill-height>
        <v-flex class="headline text-xs-center pa-3" xs12>
          {{displayStatus}}
        </v-flex>
        <v-flex>
          <v-layout xs12 sm12 row wrap align-space-around justify-center fill-height >
            <v-flex xs12 sm4>
              <v-hover>

                <v-card
                    slot-scope="{ hover }"
                    :class="`elevation-${(hover&&voted === '') ? 12 : 2} d-flex align-center`"
                    dark
                    height="200"
                    @click.native="()=>{vote('a')}"
                >
                  <v-container align-center justify-center>
                    <v-layout>
                      <v-flex class="headline text-xs-center pa-3" xs12>
                        {{dataForm.a}}
                      </v-flex>
                    </v-layout>
                  </v-container>
                  <v-expand-transition >
                    <div
                        id="overlay1"
                        v-if="(hover&&voted === '')"
                        class="d-flex text-xs-center transition-fast-in-fast-out black darken-2 v-card--reveal display-3 white--text"
                    >
                      <v-container align-center justify-center>
                        Vote
                      </v-container>
                    </div>
                  </v-expand-transition>
                  <v-expand-transition>
                    <div
                        id="result1"
                        v-if="voted !== ''"
                        :class="`d-flex text-xs-center transition-fast-in-fast-out ${(voted === 'a') ? 'black' : ''} darken-2 v-card--reveal display-3 white--text`"
                    >
                      {{percentA}}%
                    </div>
                  </v-expand-transition>
                </v-card>
              </v-hover>
            </v-flex>
            <v-flex xs0 sm1></v-flex>
            <v-flex xs12 sm4>
              <v-hover>
                <v-card
                    slot-scope="{ hover }"

                    :class="`elevation-${(hover&&voted === '') ? 12 : 2} d-flex align-center`"
                    dark
                    height="200"
                    @click.native="vote('b')"
                >
                  <v-flex class="headline text-xs-center pa-3" xs12>
                    {{dataForm.b}}
                  </v-flex>
                  <v-expand-transition >
                    <div
                        id="overlay2"
                        v-if="(hover&&voted === '')"
                        class="d-flex text-xs-center transition-fast-in-fast-out black darken-2 v-card--reveal display-3 white--text"
                    >
                      <v-container align-center justify-center>
                        Vote
                      </v-container>
                    </div>
                  </v-expand-transition>
                  <v-expand-transition>
                    <div
                        id="result2"
                        v-if="voted !== ''"
                        :class="`d-flex text-xs-center transition-fast-in-fast-out ${(voted === 'b') ? 'black' : ''} darken-2 v-card--reveal display-3 white--text`"
                    >
                      {{percentB}}%
                    </div>
                  </v-expand-transition>
                </v-card>
              </v-hover>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
  <div v-else>

    <v-flex class="headline text-xs-center pa-3" xs12>
      {{displayStatus}}
    </v-flex>
  </div>
</template>

<script>
  import {db} from '../firebase';

  export default {
    name: "vote",
    data(){
      return{
        voted: '',
        voteData: {},
        voteResult: {},
        percentA: '',
        percentB: '',
        displayStatus: '',
        resultAIndex: -1,
        resultBIndex: -1,
        resultTotalIndex: -1,
        dataAIndex: -1,
        dataBIndex: -1,
        dataStatusIndex: -1,
        dataClosedIndex: -1,

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
      voted(){
        if (this.voted === 'a'){
          this.displayStatus = `You Voted For \"${this.dataForm.a}\"`
        }
        if (this.voted === 'b'){
          this.displayStatus = `You Voted For \"${this.dataForm.b}\"`
        }
      },
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
            if(this.voted === ''){
              this.voted = 'end'
            }
          }else{
            this.voted = ''
            this.displayStatus = "Case Your Vote "
          }
        }else{
          this.voted = ''
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
      vote(choice) {
        if (this.voted !== ''){
          console.log("already voted")
          return
        }
        this.voted = choice
        const choiceIndex = this.voteResult.findIndex(x => x['.key']===choice);

        this.$firebaseRefs.voteResult.child(choice).set(this.voteResult[choiceIndex]['.value'] + 1);
        this.$firebaseRefs.voteResult.child('total').set(this.voteResult[this.resultTotalIndex]['.value'] + 1);
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
    }
  }
</script>

<style scoped>
  #overlay1 {
    /*background-color: #20ee00;*/
    position: absolute;
    z-index:100;
    opacity: 0.9;
    height: 100%;
    width:100%;
  }
  #overlay2 {
    /*background-color: #EEEEEE;*/
    position: absolute;
    z-index:100;
    opacity: 0.9;
    height: 100%;
    width:100%;
  }
  #result1 {
    /*background-color: #EEEEEE;*/
    position: absolute;
    z-index:100;
    opacity: 0.5;
    height: 100%;
    width:100%;
  }
  #result2 {
    /*background-color: #EEEEEE;*/
    position: absolute;
    z-index:100;
    opacity: 0.5;
    height: 100%;
    width:100%;
  }
  #con{
    min-height: 650px;
  }
</style>
