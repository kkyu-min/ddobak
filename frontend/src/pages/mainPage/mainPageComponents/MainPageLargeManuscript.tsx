import classes from './MainPageLargeManuscript.module.css';
import { useEffect, useState } from 'react';

const MainPageLargeManuscript: React.FC = () => {
  // 애니메이션 효과 함수
  // 각 문구의 상태를 표현하는 배열
  const [visibility, setVisibility] = useState(new Array(17).fill(false));
  const revealCharacter = (index: number) => {
    setVisibility((oldVisibility) => {
      const newVisibility = [...oldVisibility];
      newVisibility[index] = true;
      return newVisibility;
    });
  };

  useEffect(() => {
    const timeout = 4000 / 18;

    // 각 문자마다 개별 타이머를 생성합니다.
    for (let i = 0; i < 18; i++) {
      window.setTimeout(() => {
        revealCharacter(i);
      }, i * timeout);
    }

    // 컴포넌트가 언마운트되는 경우 여기에 정리 로직을 추가할 수 있습니다.
    // 예를 들면, setTimeout을 취소할 수 있습니다.

    // 주의: 만약 컴포넌트가 여러 번 렌더링되면, 이 useEffect 내에서 생성된 여러 타이머가
    // 중복 실행될 수 있습니다. 필요한 경우 타이머 ID를 추적하고 취소하는 로직을 추가하세요.
  }, []); // 의존성 배열이 비어 있으므로 이 훅은 컴포넌트가 마운트될 때 단 한 번만 실행됩니다.
  return (
    <div className={classes.container}>
      {/* 원고지 헤더 시작 */}
      <div className={classes.headerBox}>
        <div className={classes.headerTextBox}>
          <p className={classes.headerNoText}>No.</p>
          <div className={classes.headerDiv}>
            <p
              className={classes.headerBigText}
              style={{
                fontFamily: '밤톨체',
                letterSpacing: '-5px',
                fontSize: '40px',
                marginBottom: '-5px',
              }}
            >
              밤톨체
            </p>
          </div>
        </div>
      </div>
      {/* 원고지 헤더 끝 */}
      {/* 원고지 시작 */}
      <div className={classes.largeBox}>
        {/* 빈칸 */}
        <div className={classes.blankLineBox}>{renderTopBlank()}</div>
        {/* 빈칸 끝 */}
        {renderLineBoxes()}
        {/* 빈칸 */}
        <div className={classes.blankMiddleLine}>{renderLineBlank()}</div>
        {/* 빈칸 끝 */}
        {/* 라인 시작 */}
        <div className={classes.lineBox}>
          {/* 1 */}
          <div className={classes.smallBox}>
            <div className={classes.content}></div>
          </div>
          <div className={classes.smallBox}>
            <div className={classes.content}></div>
          </div>
          <div className={classes.smallBox}>
            <div className={classes.content}></div>
          </div>
          <div className={classes.smallBox}>
            <div className={classes.content}></div>
          </div>
          {/* 당 */}
          <div className={classes.smallBox}>
            <div className={classes.content}>
              <p className={classes.contentText} style={{ opacity: visibility[0] ? 1 : 0 }}>
                당
              </p>
            </div>
          </div>
          {/* 신 */}
          <div className={classes.smallBox}>
            <div className={classes.content}>
              <p className={classes.contentText} style={{ opacity: visibility[1] ? 1 : 0 }}>
                신
              </p>
            </div>
          </div>
          {/* 의 */}
          <div className={classes.smallBox}>
            <div className={classes.content}>
              <p className={classes.contentText} style={{ opacity: visibility[2] ? 1 : 0 }}>
                의
              </p>
            </div>
          </div>
          {/* 빈칸 */}
          <div className={classes.smallBox}>
            <div className={classes.content}></div>
          </div>
          {/* 손 */}
          <div className={classes.smallBox}>
            <div className={classes.content}>
              <p className={classes.contentText} style={{ opacity: visibility[3] ? 1 : 0 }}>
                손
              </p>
            </div>
          </div>
          {/* 글 */}
          <div className={classes.smallBox}>
            <div className={classes.content}>
              <p className={classes.contentText} style={{ opacity: visibility[4] ? 1 : 0 }}>
                글
              </p>
            </div>
          </div>
          {/* 씨 */}
          <div className={classes.smallBox}>
            <div className={classes.content}>
              <p className={classes.contentText} style={{ opacity: visibility[5] ? 1 : 0 }}>
                씨
              </p>
            </div>
          </div>
          {/* 를 */}
          <div className={classes.smallBox}>
            <div className={classes.content}>
              <p className={classes.contentText} style={{ opacity: visibility[6] ? 1 : 0 }}>
                를
              </p>
            </div>
          </div>
          <div className={classes.smallBox}>
            <div className={classes.content}></div>
          </div>
          <div className={classes.smallBox}>
            <div className={classes.content}></div>
          </div>
          <div className={classes.smallBox}>
            <div className={classes.content}></div>
          </div>
          <div className={classes.smallBox}>
            <div className={classes.content}></div>
          </div>
        </div>
        {/* 라인 끝 */}
        {/* 빈칸 */}
        <div className={classes.blankMiddleLine}>{renderLineBlank()}</div>
        {/* 빈칸 끝 */}
        {/* 세번 째 줄 */}
        {/* 라인 시작 */}
        <div className={classes.lineBox}>
          {/* 1 */}
          <div className={classes.smallBox}>
            <div className={classes.content}></div>
          </div>
          <div className={classes.smallBox}>
            <div className={classes.content}></div>
          </div>
          {/* 폰 */}
          <div className={classes.smallBox}>
            <div className={classes.content}>
              <p className={classes.contentText} style={{ opacity: visibility[7] ? 1 : 0 }}>
                폰
              </p>
            </div>
          </div>
          {/* 트 */}
          <div className={classes.smallBox}>
            <div className={classes.content}>
              <p className={classes.contentText} style={{ opacity: visibility[8] ? 1 : 0 }}>
                트
              </p>
            </div>
          </div>
          {/* 로 */}
          <div className={classes.smallBox}>
            <div className={classes.content}>
              <p className={classes.contentText} style={{ opacity: visibility[9] ? 1 : 0 }}>
                로
              </p>
            </div>
          </div>
          {/* 빈칸 */}
          <div className={classes.smallBox}>
            <div className={classes.content}></div>
          </div>
          {/* 만 */}
          <div className={classes.smallBox}>
            <div className={classes.content}>
              <p className={classes.contentText} style={{ opacity: visibility[10] ? 1 : 0 }}>
                만
              </p>
            </div>
          </div>
          {/* 들 */}
          <div className={classes.smallBox}>
            <div className={classes.content}>
              <p className={classes.contentText} style={{ opacity: visibility[11] ? 1 : 0 }}>
                들
              </p>
            </div>
          </div>
          {/* 어 */}
          <div className={classes.smallBox}>
            <div className={classes.content}>
              <p className={classes.contentText} style={{ opacity: visibility[12] ? 1 : 0 }}>
                어
              </p>
            </div>
          </div>
          {/* 빈칸 */}
          <div className={classes.smallBox}>
            <div className={classes.content}></div>
          </div>
          {/* 드 */}
          <div className={classes.smallBox}>
            <div className={classes.content}>
              <p className={classes.contentText} style={{ opacity: visibility[13] ? 1 : 0 }}>
                드
              </p>
            </div>
          </div>
          {/* 립 */}
          <div className={classes.smallBox}>
            <div className={classes.content}>
              <p className={classes.contentText} style={{ opacity: visibility[14] ? 1 : 0 }}>
                립
              </p>
            </div>
          </div>
          {/* 니 */}
          <div className={classes.smallBox}>
            <div className={classes.content}>
              <p className={classes.contentText} style={{ opacity: visibility[15] ? 1 : 0 }}>
                니
              </p>
            </div>
          </div>
          {/* 다 */}
          <div className={classes.smallBox}>
            <div className={classes.content}>
              <p className={classes.contentText} style={{ opacity: visibility[16] ? 1 : 0 }}>
                다
              </p>
            </div>
          </div>
          {/* . */}
          <div className={classes.smallBox}>
            <div className={classes.content}>
              <p
                className={classes.contentText}
                style={{ marginBottom: '-25px', opacity: visibility[17] ? 1 : 0 }}
              >
                .
              </p>
            </div>
          </div>
          <div className={classes.smallBox}>
            <div className={classes.content}></div>
          </div>
          <div className={classes.smallBox}>
            <div className={classes.content}></div>
          </div>
        </div>
        {/* 라인 끝 */}
        {/* 빈칸 */}
        <div className={classes.blankMiddleLine}>{renderLineBlank()}</div>
        {/* 빈칸 끝 */}
        {renderLineBoxes()}
        {/* 빈칸 */}
        <div className={classes.blankLineBox}>{renderBottomBlank()}</div>
        {/* 빈칸 끝 */}
      </div>
      {/* 원고지 끝 */}
      {/* 원고지 푸터 시작 */}
      <div className={classes.footerBox}>
        <div className={classes.footerTextBox}>
          <p className={classes.footerText}>16 X 6</p>
        </div>
      </div>
      {/* 원고지 푸터 끝 */}
    </div>
  );
};

const NUMBER_OF_LINEBOXES = 2;
// 내부 smallBox를 생성할 상수
const NUMBER_OF_SMALLBOXES = 16;

// smallBox를 생성하는 함수
const renderSmallBoxes = () => {
  let boxes = [];
  for (let i = 0; i < NUMBER_OF_SMALLBOXES; i++) {
    boxes.push(
      <div key={i + 'a'} className={classes.smallBox}>
        <div className={classes.content}></div>
      </div>,
    );
  }
  return boxes;
};

// lineBox 내부의 smallBox들을 포함하여 lineBox를 생성하는 함수
const renderLineBoxes = () => {
  let lineBoxes = [];
  for (let i = 0; i < NUMBER_OF_LINEBOXES; i++) {
    lineBoxes.push(
      <div key={i + 'b1'} className={classes.lineBox}>
        {renderSmallBoxes()}
      </div>,
    );
    if (i === 0) {
      lineBoxes.push(
        <div key={i + 'b2'} className={classes.blankMiddleLine}>
          {renderLineBlank()}
        </div>,
      );
    }
  }
  return lineBoxes;
};

const renderLineBlank = () => {
  let boxes = [];
  for (let i = 0; i < NUMBER_OF_SMALLBOXES; i++) {
    if (i === 0) {
      boxes.push(
        <div key={i + 'c1'} className={classes.blankBoxleft}>
          <div className={classes.blankContent}></div>
        </div>,
      );
    } else if (i === NUMBER_OF_SMALLBOXES - 1) {
      boxes.push(
        <div key={i + 'c2'} className={classes.blankBoxRight}>
          <div className={classes.blankContent}></div>
        </div>,
      );
    } else {
      boxes.push(
        <div key={i + 'c3'} className={classes.blankBox}>
          <div className={classes.blankContent}></div>
        </div>,
      );
    }
  }
  return boxes;
};

const renderTopBlank = () => {
  let boxes = [];
  for (let i = 0; i < NUMBER_OF_SMALLBOXES; i++) {
    boxes.push(
      <div key={i + 'd'} className={classes.blankTopBox}>
        <div className={classes.blankContent}></div>
      </div>,
    );
  }
  return boxes;
};
const renderBottomBlank = () => {
  let boxes = [];
  for (let i = 0; i < NUMBER_OF_SMALLBOXES; i++) {
    boxes.push(
      <div key={i + 'e'} className={classes.blankBottomBox}>
        <div className={classes.blankContent}></div>
      </div>,
    );
  }
  return boxes;
};
export default MainPageLargeManuscript;
