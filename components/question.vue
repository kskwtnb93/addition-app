<template>
  <div>
    <p class="count-questions">{{ status }}／{{ questions.length }} 問目</p>
    <transition-group
      tag="div"
      class="outer"
      :name="style"
    >
      <form
        v-for="question in questions"
        :key="question.id"
        class="question"
        :class="[
          'question-' + question.id,
          {
            'is-active': status === question.id,
          }
        ]"
        v-show="status === question.id"
      >
        <div class="inner">
          <p class="question__text">{{ question.text }}</p>

          <ul class="question__list">
            <li
              class="question__list__item"
              v-for="answer in question.answers"
              :key="answer.id"
            >
            <label
              @click.self="aggregatePoint(); next()"
            >
              <input
                class="question__list__item__core"
                type="radio"
                name="question.id"
                :data-points-json="JSON.stringify(answer.points)"
              >{{ answer.text }}</label>
            </li>
          </ul>

          <p
            class="question__prev"
            @click="prev"
            v-if="question.id != 1"
          >← 前の質問に戻る</p>
        </div>
        
      </form>
    </transition-group>

    <!-- <button>集計</button> -->
  </div>
</template>

<script>
module.exports = {
  data: function() {
    return {
      questions: null,
      pointList: [],
      status: 1,
      style: ''
    }
  },
  // computed: {
  // },
  created: function() {
    axios
      .get('./json/questions.json')
      .then(
        response => {
          this.questions = response.data;
          console.log(this.questions);
        }
      )
      .catch(
        error => {
          console.log(error);
        }
      )
  },
  methods: {
    aggregatePoint: function(e) {
      // 問題数をカウント
      const total_question = document.getElementsByClassName('question').length;

      console.log(total_question)

      // 最終質問回答時であれば、ポイントの合計を算出
      if(this.status !== total_question) {
        // 最終質問でなければ処理しない
        return
      } else {
        // 質問内のinputタグを変数に格納
        const checkedAnswers = document.getElementsByClassName('question__list__item__core');

        // 質問内のinputタグをループで全てチェック
        for(let i = 0; i < checkedAnswers.length; i++){
          if(checkedAnswers[i].checked){
            // 選んだ項目（checked）のdata属性からstringをobjectとして取得
            let jsonArray = JSON.parse( checkedAnswers[i].getAttribute('data-points-json') );
            // pointListに取得したオブジェクトを追加
            this.pointList = this.pointList.concat(jsonArray);
          }
        }

        let pointObjects = this.pointList;
        // 配列統合・ポイント合算
        let sumedPoints = sumObjects(pointObjects);
        // console.log(sumedPoints);

        // 同じkeyのvalueを合算する関数
        function sumObjects(pointObjects) {
          return pointObjects.reduce((res, obj) => {
            for (key in obj) {
              key in res? res[key] += obj[key]: res[key] = obj[key]
            }   
            return res 
          }, {});
        }

        // 合算したポイントオブジェクトを降順でソート
        let compare = Object.entries(sumedPoints);
        compare.sort((compare1, compare2) => {
          const compare1Val = compare1[1];
          const compare2Val = compare2[1];
          return compare2Val - compare1Val;
        })
        var sortedPoints = Object.fromEntries(compare);

        // オブジェクトを配列化
        var sortedPoints = Object.entries(sortedPoints).map(([key, value]) => ({[key]: value}));
        // console.log(sortedPoints);

        // 項目を上位３つに絞り込み
        let ndPoints = []
        for(let i = 0; i < 3; i++) {
          if(sortedPoints[i] != null) {
            ndPoints.push(sortedPoints[i])
          }
        }

        var ptPoints = {}
        for(let i = 0; i < ndPoints.length; i++) {
          // key を文字列化して整形
          var key_name = JSON.stringify( Object.keys(sortedPoints[i]) )
          var key_name = key_name.replaceAll("\"", "")
          var key_name = key_name.replace("\[", "")
          var key_name = key_name.replace("\]", "")
          // // value を文字列化して整形
          // var value_name = JSON.stringify( Object.values(sortedPoints[i]) )
          // var value_name = value_name.replaceAll("\"", "")
          // var value_name = value_name.replace("\[", "")
          // var value_name = value_name.replace("\]", "")
          ptPoints['num' + i] = key_name
        }
        // console.log(ptPoints)

        let createPath = {
          path: '/result',
          query: ptPoints
          // query: {id:"123"},
        }

        // console.log(ptPoints)

        // 結果ページに遷移
        router.push(createPath)
      }
    },
    // next: function() {
    //   const total_question = document.getElementsByClassName('question').length
    //   // statusが最大質問数を超えないようにチェック
    //   if(this.status === total_question) {
    //     return
    //   } else {
    //     this.status++
    //   }
    //   console.log(this.status)
    // },
    // prev: function() {
    //   // statusが0を下回らないようにチェック
    //   if(this.status > 1) {
    //     this.status--
    //   } else {
    //     this.status = 1
    //   }
    //   console.log(this.status)
    // }
    next() {
      const total_question = document.getElementsByClassName('question').length;

      if(this.status === total_question) {
        console.log('もう終わり');
        return
      } else {
        if (this.status > total_question - 1) {
          this.status = 1;
        } else {
          this.status++;
        }
        this.style = "slide-right"
      }
    },
    prev() {
      const total_question = document.getElementsByClassName('question').length;

      if(this.status <= 1) {
        console.log('もうない');
        return
      } else {
        if (this.status == 1) {
          this.status = total_question - 1;
        } else {
          this.status--;
        }
        this.style = "slide-left"
      }
    }
  }
}
</script>

<style scoped>
/* .fade-enter-active {
  box-sizing: border-box;
  width: 100%;
  transition: all .8s ease;
}
.fade-enter {
  transform: translateX(-100%);
}
.fade-enter-to {
}

.fade-leave-active {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  transition: all .8s ease;
  opacity: 0;
}
.fade-leave {
}
.fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
} */

.count-questions {
  text-align: center;
  font-weight: bold;
  padding: 2rem 0;
}
.outer {
  position: relative;
}
.question {
  position: absolute;
  top: 0;
  width: 100%;
  right: 0;
  left: 0;
  padding: 1rem;
}
.inner {
  padding: 3rem 2rem 6rem;
  /* border: 1px solid #333; */
  box-shadow: 0px 0px 15px -5px #808080;
  border-radius: 10px;
  text-align: center;
}
.question__text {
  font-weight: bold;
  margin-bottom: 3rem;
}
.question__list {
  display: inline;
  margin-bottom: 2rem;
}
.question__list__item {
}
.question__list__item:not(:last-child) {
  margin-bottom: 1rem;
}
.question__prev {
  text-align: center;
  background: #000;
  color: #fff;
  border-radius: 5rem;
  margin: 4rem 4rem 0;
}
.is-active {
  /* background: pink; */
  pointer-events: inherit;
}
.question__list__item {
  position: relative;
}
.question__list__item label::before {
  content: '';
  display: block;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: absolute;
  z-index: 100;
}

/* トランジション */
.slide-right-leave-active,
.slide-right-enter-active,
.slide-left-leave-active,
.slide-left-enter-active {
  transition: .5s ease;
}

.slide-right-enter,
.slide-left-leave-to {
  transform: translateX(100%);
  opacity: 1;
}

.slide-right-leave-to,
.slide-left-enter {
  transform: translateX(-100%);
  opacity: 0;
}
</style>