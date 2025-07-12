// インド音楽と現代音楽融合のための音楽生成プロンプトツール（修正版）
const musicElements = [
  { name: "音楽ジャンル", options: ["ボリウッド", "クラシカル", "ポップ", "ロック", "ジャズ", "ヒップホップ", "エレクトロニック", "フォーク", "フュージョン", "アンビエント"] },
  { name: "リズム", options: ["4/4ビート", "3/4ビート", "6/8ビート", "7/8ビート", "アフロビート", "レゲエビート", "ラテンビート", "ファンクビート", "ブレイクビート", "ダブステップビート"] },
  { name: "メロディ演奏楽器", options: ["シタール", "フルート", "シンセサイザー", "エレキギター", "ピアノ", "バイオリン", "ハルモニウム", "サーランギー", "ベースギター", "サックス"] },
  { name: "テンポ（BPM）", options: ["60-70 BPM", "70-90 BPM", "90-110 BPM", "110-130 BPM", "130-150 BPM", "150-170 BPM", "170-190 BPM", "190-210 BPM", "可変テンポ", "ルバート"] },
  { name: "ムード", options: ["ハッピー", "サッド", "ロマンチック", "エナジェティック", "カーム", "メランコリック", "フェスティブ", "スピリチュアル", "ダーク", "アップリフティング"] },
  { name: "楽器", options: ["タブラ", "シンセドラム", "シタール", "エレキギター", "バンスリ", "ベースギター", "ハルモニウム", "キーボード", "ドーラク", "エレクトロニックパッド"] },
  { name: "音楽構成", options: ["イントロ-バース-コーラス", "AABA形式", "12小節ブルース", "ラーガ展開", "ビルドアップ-ドロップ", "アンビエント展開", "ジャム形式", "テーマ-バリエーション", "循環形式", "フリーフォーム"] },
  { name: "特殊効果", options: ["リバーブ", "ディレイ", "ディストーション", "コーラス", "フランジャー", "フェイザー", "オートチューン", "サンプリング", "ループ", "なし"] }
];

let currentStep = 0;
let selections = Array(musicElements.length).fill([]);

function showOptions(step) {
  const element = musicElements[step];
  const container = document.getElementById('optionsContainer');
  container.innerHTML = '';
  
  const title = document.createElement('h2');
  title.textContent = `${element.name}を選択してください（複数選択可）`;
  title.style.color = '#333';
  title.style.marginBottom = '20px';
  container.appendChild(title);

  const progress = document.createElement('div');
  progress.textContent = `${step + 1} / ${musicElements.length}`;
  progress.style.backgroundColor = '#f0f0f0';
  progress.style.padding = '10px';
  progress.style.borderRadius = '5px';
  progress.style.marginBottom = '20px';
  progress.style.textAlign = 'center';
  container.appendChild(progress);

  const optionsDiv = document.createElement('div');
  optionsDiv.style.display = 'grid';
  optionsDiv.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
  optionsDiv.style.gap = '10px';
  optionsDiv.style.marginBottom = '20px';

  element.options.forEach(option => {
    const label = document.createElement('label');
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.padding = '10px';
    label.style.border = '1px solid #ddd';
    label.style.borderRadius = '5px';
    label.style.cursor = 'pointer';
    label.style.transition = 'background-color 0.3s';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = option;
    checkbox.name = 'option';
    checkbox.style.marginRight = '8px';
    
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(option));
    
    label.addEventListener('mouseover', () => {
      label.style.backgroundColor = '#f5f5f5';
    });
    label.addEventListener('mouseout', () => {
      if (!checkbox.checked) {
        label.style.backgroundColor = 'white';
      }
    });
    
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        label.style.backgroundColor = '#e3f2fd';
      } else {
        label.style.backgroundColor = 'white';
      }
    });
    
    optionsDiv.appendChild(label);
  });
  
  container.appendChild(optionsDiv);

  const nextButton = document.createElement('button');
  nextButton.textContent = step === musicElements.length - 1 ? '音楽生成プロンプト生成' : '次へ';
  nextButton.style.backgroundColor = '#2196F3';
  nextButton.style.color = 'white';
  nextButton.style.border = 'none';
  nextButton.style.padding = '12px 24px';
  nextButton.style.borderRadius = '5px';
  nextButton.style.cursor = 'pointer';
  nextButton.style.fontSize = '16px';
  
  nextButton.onclick = () => {
    const checkedOptions = Array.from(document.querySelectorAll('input[name="option"]:checked')).map(input => input.value);
    if (checkedOptions.length === 0) {
      alert('少なくとも1つの選択肢を選んでください。');
      return;
    }
    selections[step] = checkedOptions;
    if (step < musicElements.length - 1) {
      currentStep++;
      showOptions(currentStep);
    } else {
      generatePrompt();
    }
  };
  container.appendChild(nextButton);
}

function generatePrompt() {
  const promptContainer = document.getElementById('promptContainer');
  const englishElements = [
    { name: "Music Genre", options: ["Bollywood", "Classical", "Pop", "Rock", "Jazz", "Hip Hop", "Electronic", "Folk", "Fusion", "Ambient"] },
    { name: "Rhythm", options: ["4/4 Beat", "3/4 Beat", "6/8 Beat", "7/8 Beat", "Afro Beat", "Reggae Beat", "Latin Beat", "Funk Beat", "Breakbeat", "Dubstep Beat"] },
    { name: "Melody Instruments", options: ["Sitar", "Flute", "Synthesizer", "Electric Guitar", "Piano", "Violin", "Harmonium", "Sarangi", "Bass Guitar", "Saxophone"] },
    { name: "Tempo (BPM)", options: ["60-70 BPM", "70-90 BPM", "90-110 BPM", "110-130 BPM", "130-150 BPM", "150-170 BPM", "170-190 BPM", "190-210 BPM", "Variable Tempo", "Rubato"] },
    { name: "Mood", options: ["Happy", "Sad", "Romantic", "Energetic", "Calm", "Melancholic", "Festive", "Spiritual", "Dark", "Uplifting"] },
    { name: "Instruments", options: ["Tabla", "Synth Drums", "Sitar", "Electric Guitar", "Bansuri", "Bass Guitar", "Harmonium", "Keyboard", "Dholak", "Electronic Pads"] },
    { name: "Musical Structure", options: ["Intro-Verse-Chorus", "AABA Form", "12-Bar Blues", "Raga Development", "Buildup-Drop", "Ambient Development", "Jam Format", "Theme-Variation", "Cyclical Form", "Free Form"] },
    { name: "Special Effects", options: ["Reverb", "Delay", "Distortion", "Chorus", "Flanger", "Phaser", "Auto-Tune", "Sampling", "Looping", "None"] }
  ];

  const englishSelections = selections.map((selection, index) => {
    return selection.map(item => {
      const elementIndex = musicElements[index].options.indexOf(item);
      return englishElements[index].options[elementIndex];
    });
  });

  const promptText = `Create a fusion music track combining Indian and modern elements with the following specifications: ` +
    englishElements.map((element, i) => `${element.name}: ${englishSelections[i].join(', ')}`).join('; ') +
    `. The composition should seamlessly blend traditional Indian musical elements with contemporary production techniques. Focus on creating an authentic yet innovative sound that appeals to both traditional music lovers and modern audiences. Ensure the track maintains cultural integrity while incorporating cutting-edge musical production for digital streaming platforms and global distribution.`;

  promptContainer.innerHTML = '';
  
  const title = document.createElement('h2');
  title.textContent = '生成されたプロンプト';
  title.style.color = '#333';
  title.style.marginBottom = '20px';
  promptContainer.appendChild(title);
  
  const promptDiv = document.createElement('div');
  promptDiv.textContent = promptText;
  promptDiv.style.backgroundColor = '#f9f9f9';
  promptDiv.style.padding = '20px';
  promptDiv.style.borderRadius = '5px';
  promptDiv.style.border = '1px solid #ddd';
  promptDiv.style.whiteSpace = 'pre-wrap';
  promptDiv.style.lineHeight = '1.6';
  promptDiv.style.marginBottom = '20px';
  promptContainer.appendChild(promptDiv);
  
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.gap = '10px';
  
  const regenerateButton = document.createElement('button');
  regenerateButton.textContent = '再生成';
  regenerateButton.style.backgroundColor = '#4CAF50';
  regenerateButton.style.color = 'white';
  regenerateButton.style.border = 'none';
  regenerateButton.style.padding = '12px 24px';
  regenerateButton.style.borderRadius = '5px';
  regenerateButton.style.cursor = 'pointer';
  regenerateButton.onclick = regenerate;
  
  const startOverButton = document.createElement('button');
  startOverButton.textContent = '最初から';
  startOverButton.style.backgroundColor = '#FF9800';
  startOverButton.style.color = 'white';
  startOverButton.style.border = 'none';
  startOverButton.style.padding = '12px 24px';
  startOverButton.style.borderRadius = '5px';
  startOverButton.style.cursor = 'pointer';
  startOverButton.onclick = startOver;
  
  buttonContainer.appendChild(regenerateButton);
  buttonContainer.appendChild(startOverButton);
  promptContainer.appendChild(buttonContainer);
  
  document.getElementById('optionsContainer').style.display = 'none';
  promptContainer.style.display = 'block';
}

function regenerate() {
  generatePrompt();
}

function startOver() {
  selections = Array(musicElements.length).fill([]);
  currentStep = 0;
  document.getElementById('promptContainer').style.display = 'none';
  document.getElementById('optionsContainer').style.display = 'block';
  showOptions(currentStep);
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  container.style.maxWidth = '800px';
  container.style.margin = '0 auto';
  container.style.padding = '20px';
  container.style.fontFamily = 'Arial, sans-serif';
  
  const optionsContainer = document.createElement('div');
  optionsContainer.id = 'optionsContainer';
  
  const promptContainer = document.createElement('div');
  promptContainer.id = 'promptContainer';
  promptContainer.style.display = 'none';
  
  container.appendChild(optionsContainer);
  container.appendChild(promptContainer);
  document.body.appendChild(container);
  
  showOptions(currentStep);
});
