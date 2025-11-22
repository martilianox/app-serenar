"use client"

import { useState, useEffect } from "react"
import { 
  Heart, BookOpen, TrendingUp, Wind, Shield, MessageCircle, 
  Calendar, BarChart3, Sparkles, Menu, X, AlertCircle, 
  Brain, Activity, Moon, Coffee, Users, Award, Download,
  Play, Pause, CheckCircle, ChevronRight, Home, User,
  Clock, Target, Zap, Phone, Eye, Ear, Hand, Smile
} from "lucide-react"

type View = "home" | "onboarding" | "monitor" | "diary" | "exercises" | "emergency" | "chat" | "calendar" | "community" | "profile"

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("onboarding")
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [selectedMood, setSelectedMood] = useState<string>("")
  const [anxietyLevel, setAnxietyLevel] = useState(5)
  const [diaryEntry, setDiaryEntry] = useState("")
  const [breathingActive, setBreathingActive] = useState(false)
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [breathCount, setBreathCount] = useState(0)
  const [showChat, setShowChat] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)
  const [exerciseTimer, setExerciseTimer] = useState(0)
  const [exerciseRunning, setExerciseRunning] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([
    { role: 'assistant', content: 'Olá, eu sou o Médico Amigo. Estou aqui para te ouvir e ajudar. Como você está se sentindo agora?' }
  ])
  const [chatInput, setChatInput] = useState("")
  const [quickNotes, setQuickNotes] = useState("")
  const [triggers, setTriggers] = useState<string[]>([])
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [groundingStep, setGroundingStep] = useState(0)
  
  // Onboarding data
  const [onboardingData, setOnboardingData] = useState({
    dailyAnxiety: "",
    symptoms: [] as string[],
    moments: [] as string[],
    hasProfessional: "",
    goals: [] as string[]
  })

  const moods = [
    { emoji: "😊", label: "Tranquilo", color: "bg-[#B0EACD]", value: 2 },
    { emoji: "😌", label: "Calmo", color: "bg-[#A0D8E7]", value: 4 },
    { emoji: "😐", label: "Neutro", color: "bg-[#C3B1E1]", value: 5 },
    { emoji: "😟", label: "Ansioso", color: "bg-[#7B9CC9]", value: 7 },
    { emoji: "😰", label: "Muito ansioso", color: "bg-[#3A5A98] text-white", value: 9 },
  ]

  const symptomsList = [
    "Taquicardia", "Aperto no peito", "Pensamentos acelerados", 
    "Sudorese", "Tremores", "Falta de ar", "Tensão muscular", "Insônia"
  ]

  const momentsList = [
    "Manhã", "Tarde", "Noite", "Trabalho", "Sozinho", "Em público", "Antes de dormir"
  ]

  const goalsList = [
    "Dormir melhor", "Controlar crises", "Reduzir pensamentos acelerados",
    "Melhorar autoconhecimento", "Ter mais calma no dia a dia"
  ]

  const triggersList = [
    "Trabalho", "Relacionamentos", "Saúde", "Finanças", "Família", 
    "Solidão", "Multidão", "Prazos", "Conflitos", "Incerteza"
  ]

  const exercises = [
    {
      id: "4-7-8",
      name: "Respiração 4-7-8",
      description: "Inspire por 4, segure por 7, expire por 8 segundos. Perfeita para acalmar rapidamente.",
      duration: 300,
      category: "Respiração",
      instructions: [
        "Encontre uma posição confortável",
        "Inspire pelo nariz contando até 4",
        "Segure a respiração contando até 7",
        "Expire pela boca contando até 8",
        "Repita o ciclo 4 vezes"
      ]
    },
    {
      id: "box",
      name: "Respiração Caixa",
      description: "Inspire 4, segure 4, expire 4, segure 4. Usada por militares para controle emocional.",
      duration: 240,
      category: "Respiração",
      instructions: [
        "Sente-se confortavelmente",
        "Inspire contando até 4",
        "Segure contando até 4",
        "Expire contando até 4",
        "Segure contando até 4",
        "Repita por 4 minutos"
      ]
    },
    {
      id: "coherence",
      name: "Coerência Cardíaca",
      description: "5 segundos inspirando, 5 expirando. Sincroniza coração e mente.",
      duration: 300,
      category: "Respiração",
      instructions: [
        "Respire profundamente por 5 segundos",
        "Expire lentamente por 5 segundos",
        "Mantenha o ritmo constante",
        "Foque na sensação de calma"
      ]
    },
    {
      id: "anti-panic",
      name: "Respiração Anti-Pânico",
      description: "Técnica rápida para interromper crises de pânico.",
      duration: 180,
      category: "Respiração",
      instructions: [
        "Inspire pelo nariz por 2 segundos",
        "Expire pela boca por 4 segundos",
        "Repita até sentir alívio",
        "Foque apenas na respiração"
      ]
    },
    {
      id: "grounding",
      name: "Grounding 5-4-3-2-1",
      description: "Técnica sensorial para te trazer de volta ao presente durante crises.",
      duration: 300,
      category: "Crise",
      instructions: [
        "5 coisas que você VÊ ao seu redor",
        "4 coisas que você pode TOCAR",
        "3 coisas que você OUVE",
        "2 coisas que você CHEIRA",
        "1 coisa que você pode SABOREAR"
      ]
    },
    {
      id: "progressive",
      name: "Relaxamento Muscular Progressivo",
      description: "Tensione e relaxe grupos musculares para liberar tensão física.",
      duration: 600,
      category: "Crise",
      instructions: [
        "Tensione os pés por 5 segundos, depois relaxe",
        "Suba para as pernas, depois abdômen",
        "Continue com braços, ombros e rosto",
        "Sinta a diferença entre tensão e relaxamento"
      ]
    },
    {
      id: "anchor",
      name: "Técnica da Âncora",
      description: "Use um objeto ou sensação como âncora emocional.",
      duration: 240,
      category: "Crise",
      instructions: [
        "Escolha um objeto próximo",
        "Observe todos os detalhes dele",
        "Toque-o e sinta a textura",
        "Use-o como âncora para o presente"
      ]
    },
    {
      id: "meditation-1",
      name: "Meditação 1 minuto",
      description: "Pausa rápida para resetar a mente.",
      duration: 60,
      category: "Meditação",
      instructions: [
        "Feche os olhos suavemente",
        "Foque apenas na sua respiração",
        "Não julgue pensamentos que surgirem",
        "Apenas observe e deixe passar"
      ]
    },
    {
      id: "meditation-3",
      name: "Meditação 3 minutos",
      description: "Meditação guiada para acalmar pensamentos acelerados.",
      duration: 180,
      category: "Meditação",
      instructions: [
        "Encontre um lugar tranquilo",
        "Respire naturalmente",
        "Observe seus pensamentos sem julgamento",
        "Retorne à respiração quando se distrair"
      ]
    },
    {
      id: "meditation-5",
      name: "Meditação 5 minutos",
      description: "Prática mais profunda para clareza mental.",
      duration: 300,
      category: "Meditação",
      instructions: [
        "Sente-se confortavelmente",
        "Escaneie seu corpo da cabeça aos pés",
        "Relaxe cada parte conscientemente",
        "Permaneça presente no momento"
      ]
    },
    {
      id: "meditation-10",
      name: "Meditação 10 minutos",
      description: "Sessão completa para paz profunda.",
      duration: 600,
      category: "Meditação",
      instructions: [
        "Dedique este tempo só para você",
        "Respire profundamente",
        "Deixe pensamentos fluírem",
        "Cultive gratidão e paz interior"
      ]
    }
  ]

  const groundingSteps = [
    { 
      title: "5 coisas que você VÊ", 
      icon: Eye,
      prompt: "Olhe ao redor. Nomeie 5 coisas que você pode ver agora.",
      examples: ["Uma cadeira", "A parede", "Suas mãos", "Uma janela", "Um objeto"]
    },
    { 
      title: "4 coisas que você pode TOCAR", 
      icon: Hand,
      prompt: "Toque em 4 coisas ao seu redor. Sinta a textura.",
      examples: ["A mesa", "Sua roupa", "O chão", "Um objeto próximo"]
    },
    { 
      title: "3 coisas que você OUVE", 
      icon: Ear,
      prompt: "Feche os olhos. Que sons você consegue ouvir?",
      examples: ["Sua respiração", "Sons distantes", "O silêncio"]
    },
    { 
      title: "2 coisas que você CHEIRA", 
      icon: Smile,
      prompt: "Que cheiros você percebe agora?",
      examples: ["O ar", "Perfume", "Ambiente"]
    },
    { 
      title: "1 coisa que você pode SABOREAR", 
      icon: Smile,
      prompt: "Que gosto você sente na boca?",
      examples: ["Água", "Algo que comeu", "O próprio gosto da boca"]
    }
  ]

  // Exercise timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (exerciseRunning && exerciseTimer > 0) {
      interval = setInterval(() => {
        setExerciseTimer(prev => prev - 1)
      }, 1000)
    } else if (exerciseTimer === 0 && exerciseRunning) {
      setExerciseRunning(false)
    }
    return () => clearInterval(interval)
  }, [exerciseRunning, exerciseTimer])

  // Breathing animation
  useEffect(() => {
    if (!breathingActive) return

    const phases = [
      { name: "inhale" as const, duration: 4000, text: "Inspire..." },
      { name: "hold" as const, duration: 4000, text: "Segure..." },
      { name: "exhale" as const, duration: 4000, text: "Expire..." }
    ]

    let currentPhaseIndex = 0
    let cycleCount = 0

    const runCycle = () => {
      if (!breathingActive) return

      const phase = phases[currentPhaseIndex]
      setBreathPhase(phase.name)

      setTimeout(() => {
        currentPhaseIndex++
        if (currentPhaseIndex >= phases.length) {
          currentPhaseIndex = 0
          cycleCount++
          setBreathCount(cycleCount)
        }
        if (breathingActive) runCycle()
      }, phase.duration)
    }

    runCycle()
  }, [breathingActive])

  const startExercise = (duration: number) => {
    setExerciseTimer(duration)
    setExerciseRunning(true)
  }

  const toggleExercise = () => {
    setExerciseRunning(!exerciseRunning)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const startBreathing = () => {
    setBreathingActive(true)
    setBreathCount(0)
    setBreathPhase("inhale")
  }

  const stopBreathing = () => {
    setBreathingActive(false)
    setBreathPhase("inhale")
    setBreathCount(0)
  }

  const handleChatSend = () => {
    if (!chatInput.trim()) return
    
    setChatMessages([...chatMessages, 
      { role: 'user', content: chatInput },
      { role: 'assistant', content: 'Entendo como você está se sentindo. Isso deve ser muito difícil. Você está sentindo algum sintoma físico agora, como taquicardia ou falta de ar?' }
    ])
    setChatInput("")
  }

  const saveMonitoring = () => {
    // Aqui salvaria os dados
    alert("Registro salvo com sucesso! Continue cuidando de você. 💙")
    setCurrentView("home")
  }

  const saveDiary = () => {
    // Aqui salvaria o diário
    alert("Diário salvo! A IA está analisando seus padrões para te ajudar melhor. 💙")
  }

  const exportDiaryPDF = () => {
    alert("PDF gerado! Você pode compartilhar com seu psicólogo ou psiquiatra. 📄")
  }

  // Onboarding steps
  const onboardingSteps = [
    {
      title: "Bem-vindo ao Serenar",
      subtitle: "Um espaço seguro, acolhedor e feito especialmente para você",
      content: (
        <div className="text-center py-8">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#A0D8E7] to-[#C3B1E1] flex items-center justify-center shadow-2xl">
            <Heart className="w-16 h-16 text-white" />
          </div>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            Aqui você não será julgado. Apenas acolhido.
          </p>
          <p className="text-gray-500">
            Vamos conhecer você melhor para criar uma experiência personalizada?
          </p>
        </div>
      )
    },
    {
      title: "Você sente ansiedade com frequência?",
      subtitle: "Não há resposta certa ou errada. Queremos apenas te entender melhor.",
      content: (
        <div className="space-y-3">
          {[
            { text: "Sim, todos os dias", emoji: "😰" },
            { text: "Algumas vezes por semana", emoji: "😟" },
            { text: "Raramente", emoji: "😌" },
            { text: "Não tenho certeza", emoji: "🤔" }
          ].map(option => (
            <button
              key={option.text}
              onClick={() => setOnboardingData({...onboardingData, dailyAnxiety: option.text})}
              className={`w-full p-5 rounded-2xl text-left transition-all duration-300 flex items-center gap-4 ${
                onboardingData.dailyAnxiety === option.text
                  ? "bg-[#A0D8E7] text-white shadow-xl scale-105"
                  : "bg-gray-50 hover:bg-gray-100 hover:scale-102"
              }`}
            >
              <span className="text-3xl">{option.emoji}</span>
              <span className="font-medium">{option.text}</span>
            </button>
          ))}
        </div>
      )
    },
    {
      title: "O que você costuma sentir?",
      subtitle: "Selecione todos os sintomas que você reconhece em si",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {symptomsList.map(symptom => (
            <button
              key={symptom}
              onClick={() => {
                const newSymptoms = onboardingData.symptoms.includes(symptom)
                  ? onboardingData.symptoms.filter(s => s !== symptom)
                  : [...onboardingData.symptoms, symptom]
                setOnboardingData({...onboardingData, symptoms: newSymptoms})
              }}
              className={`p-4 rounded-2xl text-sm transition-all duration-300 ${
                onboardingData.symptoms.includes(symptom)
                  ? "bg-[#B0EACD] text-[#3A5A98] shadow-lg scale-105"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              {symptom}
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Em que momentos isso acontece?",
      subtitle: "Identificar padrões é o primeiro passo para o autocuidado",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {momentsList.map(moment => (
            <button
              key={moment}
              onClick={() => {
                const newMoments = onboardingData.moments.includes(moment)
                  ? onboardingData.moments.filter(m => m !== moment)
                  : [...onboardingData.moments, moment]
                setOnboardingData({...onboardingData, moments: newMoments})
              }}
              className={`p-4 rounded-2xl text-sm transition-all duration-300 ${
                onboardingData.moments.includes(moment)
                  ? "bg-[#C3B1E1] text-white shadow-lg scale-105"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              {moment}
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Você faz acompanhamento profissional?",
      subtitle: "Psicólogo, psiquiatra ou outro profissional de saúde mental",
      content: (
        <div className="space-y-3">
          {[
            { text: "Sim, regularmente", emoji: "✅" },
            { text: "Sim, mas não com frequência", emoji: "🔄" },
            { text: "Não, mas gostaria", emoji: "💭" },
            { text: "Não", emoji: "❌" }
          ].map(option => (
            <button
              key={option.text}
              onClick={() => setOnboardingData({...onboardingData, hasProfessional: option.text})}
              className={`w-full p-5 rounded-2xl text-left transition-all duration-300 flex items-center gap-4 ${
                onboardingData.hasProfessional === option.text
                  ? "bg-[#A0D8E7] text-white shadow-xl scale-105"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <span className="text-2xl">{option.emoji}</span>
              <span className="font-medium">{option.text}</span>
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Quais são seus objetivos?",
      subtitle: "O que você gostaria de alcançar com o Serenar?",
      content: (
        <div className="space-y-3">
          {goalsList.map(goal => (
            <button
              key={goal}
              onClick={() => {
                const newGoals = onboardingData.goals.includes(goal)
                  ? onboardingData.goals.filter(g => g !== goal)
                  : [...onboardingData.goals, goal]
                setOnboardingData({...onboardingData, goals: newGoals})
              }}
              className={`w-full p-4 rounded-2xl text-left transition-all duration-300 ${
                onboardingData.goals.includes(goal)
                  ? "bg-[#B0EACD] text-[#3A5A98] shadow-lg scale-105"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Tudo pronto! 🎉",
      subtitle: "Seu perfil emocional foi criado com carinho",
      content: (
        <div className="text-center py-8">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#B0EACD] to-[#A0D8E7] flex items-center justify-center shadow-2xl animate-pulse">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            Com base nas suas respostas, criamos um plano personalizado para você começar sua jornada de autocuidado.
          </p>
          <div className="bg-gradient-to-br from-[#A0D8E7]/20 to-[#C3B1E1]/20 rounded-3xl p-6 text-left border-2 border-[#A0D8E7]/30">
            <h4 className="font-bold text-[#3A5A98] mb-4 text-lg">✨ Seu plano semanal personalizado:</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                <Wind className="w-5 h-5 text-[#3A5A98] flex-shrink-0" />
                <span className="text-sm">3 exercícios de respiração</span>
              </li>
              <li className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                <BookOpen className="w-5 h-5 text-[#3A5A98] flex-shrink-0" />
                <span className="text-sm">2 registros no diário emocional</span>
              </li>
              <li className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                <Brain className="w-5 h-5 text-[#3A5A98] flex-shrink-0" />
                <span className="text-sm">1 meditação guiada</span>
              </li>
              <li className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
                <Activity className="w-5 h-5 text-[#3A5A98] flex-shrink-0" />
                <span className="text-sm">Monitoramento diário do humor</span>
              </li>
            </ul>
          </div>
        </div>
      )
    }
  ]

  // Navigation
  const navigationItems = [
    { id: "home" as View, icon: Home, label: "Início" },
    { id: "monitor" as View, icon: Activity, label: "Registrar" },
    { id: "diary" as View, icon: BookOpen, label: "Diário" },
    { id: "exercises" as View, icon: Wind, label: "Exercícios" },
    { id: "emergency" as View, icon: AlertCircle, label: "SOS" },
  ]

  const getBreathingText = () => {
    switch(breathPhase) {
      case "inhale": return "Inspire profundamente..."
      case "hold": return "Segure a respiração..."
      case "exhale": return "Expire lentamente..."
    }
  }

  const getBreathingScale = () => {
    switch(breathPhase) {
      case "inhale": return "scale-125"
      case "hold": return "scale-125"
      case "exhale": return "scale-75"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A0D8E7]/20 via-white to-[#C3B1E1]/20">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[#A0D8E7]/30 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setCurrentView("home")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A0D8E7] to-[#C3B1E1] flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#3A5A98] to-[#7B9CC9] bg-clip-text text-transparent">
                Serenar
              </h1>
            </button>
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden p-2 rounded-lg hover:bg-[#A0D8E7]/20 transition-colors"
            >
              {menuOpen ? <X className="w-6 h-6 text-[#3A5A98]" /> : <Menu className="w-6 h-6 text-[#3A5A98]" />}
            </button>
            <nav className="hidden sm:flex gap-2">
              {navigationItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
                    currentView === item.id
                      ? "bg-gradient-to-r from-[#A0D8E7] to-[#C3B1E1] text-white shadow-lg"
                      : "text-[#3A5A98] hover:bg-[#A0D8E7]/20"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
          {menuOpen && (
            <nav className="sm:hidden mt-4 flex flex-col gap-2 pb-2">
              {navigationItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id)
                    setMenuOpen(false)
                  }}
                  className={`px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                    currentView === item.id
                      ? "bg-gradient-to-r from-[#A0D8E7] to-[#C3B1E1] text-white shadow-lg"
                      : "text-[#3A5A98] hover:bg-[#A0D8E7]/20"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Onboarding View */}
        {currentView === "onboarding" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-[#A0D8E7]/30">
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500 font-medium">
                    Passo {onboardingStep + 1} de {onboardingSteps.length}
                  </span>
                  <div className="flex gap-1">
                    {onboardingSteps.map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i <= onboardingStep ? "w-8 bg-gradient-to-r from-[#A0D8E7] to-[#C3B1E1]" : "w-2 bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-[#3A5A98] mb-2">
                  {onboardingSteps[onboardingStep].title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {onboardingSteps[onboardingStep].subtitle}
                </p>
              </div>

              {onboardingSteps[onboardingStep].content}

              <div className="flex gap-3 mt-8">
                {onboardingStep > 0 && (
                  <button
                    onClick={() => setOnboardingStep(onboardingStep - 1)}
                    className="px-6 py-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all font-medium"
                  >
                    Voltar
                  </button>
                )}
                <button
                  onClick={() => {
                    if (onboardingStep < onboardingSteps.length - 1) {
                      setOnboardingStep(onboardingStep + 1)
                    } else {
                      setCurrentView("home")
                    }
                  }}
                  className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-[#A0D8E7] to-[#C3B1E1] text-white hover:shadow-xl transition-all font-medium"
                >
                  {onboardingStep === onboardingSteps.length - 1 ? "Começar minha jornada" : "Continuar"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Home View */}
        {currentView === "home" && (
          <>
            {/* Welcome Section */}
            <section className="mb-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#3A5A98] mb-3">
                Olá! Como você está hoje?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                Este é o seu espaço seguro. Vamos cuidar da sua mente juntos, um passo de cada vez. 💙
              </p>
            </section>

            {/* Quick Actions - 2 toques para qualquer função */}
            <section className="mb-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => setCurrentView("monitor")}
                className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#A0D8E7]/30 text-left group hover:scale-105"
              >
                <Activity className="w-10 h-10 text-[#A0D8E7] mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-[#3A5A98] mb-1 text-lg">Registrar Agora</h3>
                <p className="text-sm text-gray-600">Como você está? (10 segundos)</p>
              </button>

              <button
                onClick={() => setCurrentView("diary")}
                className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#C3B1E1]/30 text-left group hover:scale-105"
              >
                <BookOpen className="w-10 h-10 text-[#C3B1E1] mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-[#3A5A98] mb-1 text-lg">Diário com IA</h3>
                <p className="text-sm text-gray-600">Escreva e receba insights</p>
              </button>

              <button
                onClick={() => setCurrentView("exercises")}
                className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#B0EACD]/30 text-left group hover:scale-105"
              >
                <Wind className="w-10 h-10 text-[#B0EACD] mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-[#3A5A98] mb-1 text-lg">Exercícios</h3>
                <p className="text-sm text-gray-600">Respiração, meditação e mais</p>
              </button>

              <button
                onClick={() => setCurrentView("emergency")}
                className="p-6 bg-gradient-to-br from-[#3A5A98] to-[#7B9CC9] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-left group text-white hover:scale-105"
              >
                <AlertCircle className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform animate-pulse" />
                <h3 className="font-bold mb-1 text-lg">SOS Emocional</h3>
                <p className="text-sm opacity-90">Socorro imediato para crises</p>
              </button>
            </section>

            {/* Alert if anxiety pattern detected */}
            <section className="mb-8 bg-gradient-to-r from-[#3A5A98]/10 to-[#7B9CC9]/10 border-l-4 border-[#3A5A98] rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <Brain className="w-6 h-6 text-[#3A5A98] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-[#3A5A98] mb-2">💡 Alerta de bem-estar</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Percebi que sua ansiedade aumentou nos últimos 3 dias. Que tal fazer uma pausa agora e praticar um exercício de respiração?
                  </p>
                  <button
                    onClick={() => setCurrentView("exercises")}
                    className="text-sm text-[#3A5A98] font-bold hover:underline flex items-center gap-1"
                  >
                    Ver exercícios recomendados <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* Progress Overview */}
            <section className="mb-8 bg-white rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-[#B0EACD]/30">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-[#3A5A98]" />
                  <h3 className="text-2xl font-bold text-[#3A5A98]">Sua Evolução</h3>
                </div>
                <button
                  onClick={() => setCurrentView("calendar")}
                  className="text-sm text-[#3A5A98] hover:underline flex items-center gap-1 font-medium"
                >
                  Ver detalhes
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-[#B0EACD]/30 to-[#B0EACD]/10 rounded-2xl border border-[#B0EACD]/30">
                  <div className="text-4xl font-bold text-[#3A5A98] mb-2">7</div>
                  <div className="text-sm text-gray-600 font-medium">Dias consecutivos</div>
                  <div className="text-xs text-gray-500 mt-1">Continue assim! 🎉</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-[#A0D8E7]/30 to-[#A0D8E7]/10 rounded-2xl border border-[#A0D8E7]/30">
                  <div className="text-4xl font-bold text-[#3A5A98] mb-2">24</div>
                  <div className="text-sm text-gray-600 font-medium">Exercícios realizados</div>
                  <div className="text-xs text-gray-500 mt-1">Você está indo bem!</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-[#C3B1E1]/30 to-[#C3B1E1]/10 rounded-2xl border border-[#C3B1E1]/30">
                  <div className="text-4xl font-bold text-[#3A5A98] mb-2">12</div>
                  <div className="text-sm text-gray-600 font-medium">Registros no diário</div>
                  <div className="text-xs text-gray-500 mt-1">Autoconhecimento crescendo</div>
                </div>
              </div>
            </section>

            {/* Weekly Plan */}
            <section className="mb-8 bg-gradient-to-br from-[#A0D8E7]/30 to-[#C3B1E1]/30 rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-[#A0D8E7]/50">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-[#3A5A98]" />
                <h3 className="text-2xl font-bold text-[#3A5A98]">Plano da Semana</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-white/70 rounded-2xl hover:bg-white/90 transition-all">
                  <CheckCircle className="w-5 h-5 text-[#B0EACD] flex-shrink-0" />
                  <span className="flex-1 text-gray-700 font-medium">3 exercícios de respiração</span>
                  <span className="text-sm font-bold text-[#3A5A98] bg-[#B0EACD]/20 px-3 py-1 rounded-full">2/3</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/70 rounded-2xl hover:bg-white/90 transition-all">
                  <CheckCircle className="w-5 h-5 text-[#B0EACD] flex-shrink-0" />
                  <span className="flex-1 text-gray-700 font-medium">2 meditações guiadas</span>
                  <span className="text-sm font-bold text-[#3A5A98] bg-[#A0D8E7]/20 px-3 py-1 rounded-full">1/2</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/70 rounded-2xl hover:bg-white/90 transition-all">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                  <span className="flex-1 text-gray-700 font-medium">1 diário emocional</span>
                  <span className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">0/1</span>
                </div>
              </div>
            </section>

            {/* AI Assistant Card */}
            <section className="bg-gradient-to-br from-[#3A5A98] to-[#7B9CC9] rounded-3xl shadow-2xl p-6 sm:p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-7 h-7" />
                <h3 className="text-2xl font-bold">Médico Amigo</h3>
              </div>
              <p className="mb-6 opacity-90 leading-relaxed">
                Precisa conversar agora? Estou aqui para te ouvir, acolher e ajudar você a encontrar clareza. Sem julgamentos, apenas apoio.
              </p>
              <button
                onClick={() => setCurrentView("chat")}
                className="w-full bg-white text-[#3A5A98] py-4 rounded-full font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Conversar Agora
              </button>
            </section>
          </>
        )}

        {/* Monitor View */}
        {currentView === "monitor" && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setCurrentView("home")}
                className="text-[#3A5A98] hover:underline flex items-center gap-1 mb-4 font-medium"
              >
                ← Voltar
              </button>
              <h2 className="text-3xl font-bold text-[#3A5A98] mb-2">Registro Rápido</h2>
              <p className="text-gray-600">Leva menos de 10 segundos. Como você está agora?</p>
            </div>

            <div className="space-y-6">
              {/* Mood Selection */}
              <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-[#A0D8E7]/30">
                <h3 className="text-xl font-bold text-[#3A5A98] mb-5">Como você está se sentindo?</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {moods.map((mood) => (
                    <button
                      key={mood.label}
                      onClick={() => setSelectedMood(mood.label)}
                      className={`p-5 rounded-2xl transition-all duration-300 hover:scale-105 ${
                        selectedMood === mood.label
                          ? `${mood.color} shadow-2xl scale-105`
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="text-5xl mb-2">{mood.emoji}</div>
                      <div className={`text-sm font-bold ${selectedMood === mood.label && mood.color.includes('3A5A98') ? 'text-white' : 'text-gray-700'}`}>
                        {mood.label}
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Anxiety Level */}
              <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-[#C3B1E1]/30">
                <h3 className="text-xl font-bold text-[#3A5A98] mb-5">Nível de ansiedade agora</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={anxietyLevel}
                    onChange={(e) => setAnxietyLevel(Number(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#A0D8E7]"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>1 - Calmo</span>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-[#3A5A98] mb-1">{anxietyLevel}</div>
                      <div className="text-xs text-gray-500">
                        {anxietyLevel <= 3 ? "Você está bem" : anxietyLevel <= 6 ? "Ansiedade moderada" : "Ansiedade elevada"}
                      </div>
                    </div>
                    <span>10 - Muito ansioso</span>
                  </div>
                </div>
              </section>

              {/* Triggers */}
              <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-[#B0EACD]/30">
                <h3 className="text-xl font-bold text-[#3A5A98] mb-5">Gatilhos percebidos (opcional)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {triggersList.map(trigger => (
                    <button
                      key={trigger}
                      onClick={() => {
                        setTriggers(prev => 
                          prev.includes(trigger) ? prev.filter(t => t !== trigger) : [...prev, trigger]
                        )
                      }}
                      className={`p-3 rounded-xl text-sm transition-all duration-300 ${
                        triggers.includes(trigger)
                          ? "bg-[#B0EACD] text-[#3A5A98] shadow-lg scale-105 font-bold"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      {trigger}
                    </button>
                  ))}
                </div>
              </section>

              {/* Physical Symptoms */}
              <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-[#C3B1E1]/30">
                <h3 className="text-xl font-bold text-[#3A5A98] mb-5">Sintomas físicos (opcional)</h3>
                <div className="grid grid-cols-2 gap-3">
                  {symptomsList.map(symptom => (
                    <button
                      key={symptom}
                      onClick={() => {
                        setSymptoms(prev => 
                          prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
                        )
                      }}
                      className={`p-3 rounded-xl text-sm transition-all duration-300 ${
                        symptoms.includes(symptom)
                          ? "bg-[#C3B1E1] text-white shadow-lg scale-105 font-bold"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </section>

              {/* Quick Notes */}
              <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-[#A0D8E7]/30">
                <h3 className="text-xl font-bold text-[#3A5A98] mb-4">Observações (opcional)</h3>
                <textarea
                  value={quickNotes}
                  onChange={(e) => setQuickNotes(e.target.value)}
                  placeholder="O que aconteceu? Como você reagiu? Qualquer coisa que queira lembrar..."
                  className="w-full h-32 p-4 border-2 border-[#A0D8E7]/30 rounded-2xl focus:outline-none focus:border-[#A0D8E7] transition-colors resize-none"
                />
              </section>

              <button 
                onClick={saveMonitoring}
                className="w-full bg-gradient-to-r from-[#A0D8E7] to-[#C3B1E1] text-white py-5 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Salvar Registro
              </button>

              {/* Alert Example */}
              {anxietyLevel >= 7 && (
                <div className="bg-gradient-to-r from-[#3A5A98]/10 to-[#7B9CC9]/10 border-l-4 border-[#3A5A98] p-6 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-[#3A5A98] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-[#3A5A98] mb-2">⚠️ Sua ansiedade está elevada</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Que tal fazer uma pausa agora? Um exercício de respiração pode ajudar muito a acalmar.
                      </p>
                      <button
                        onClick={() => setCurrentView("exercises")}
                        className="text-sm text-[#3A5A98] font-bold hover:underline flex items-center gap-1"
                      >
                        Ver exercícios recomendados <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Diary View */}
        {currentView === "diary" && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setCurrentView("home")}
                className="text-[#3A5A98] hover:underline flex items-center gap-1 mb-4 font-medium"
              >
                ← Voltar
              </button>
              <h2 className="text-3xl font-bold text-[#3A5A98] mb-2">Diário Emocional com IA</h2>
              <p className="text-gray-600">Escreva livremente. A IA vai te ajudar a entender seus padrões e emoções.</p>
            </div>

            <div className="space-y-6">
              <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-[#C3B1E1]/30">
                <h3 className="text-xl font-bold text-[#3A5A98] mb-4">O que está passando pela sua mente?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Não há julgamento aqui. Escreva seus pensamentos, sentimentos, medos ou preocupações. Este é o seu espaço seguro.
                </p>
                <textarea
                  value={diaryEntry}
                  onChange={(e) => setDiaryEntry(e.target.value)}
                  placeholder="Hoje eu me senti...&#10;&#10;O que me deixou ansioso foi...&#10;&#10;Eu gostaria de..."
                  className="w-full h-80 p-5 border-2 border-[#C3B1E1]/30 rounded-2xl focus:outline-none focus:border-[#C3B1E1] transition-colors resize-none text-gray-700 leading-relaxed"
                />
                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={saveDiary}
                    className="flex-1 bg-gradient-to-r from-[#C3B1E1] to-[#A0D8E7] text-white py-4 rounded-full font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    Salvar e Analisar com IA
                  </button>
                  <button 
                    onClick={exportDiaryPDF}
                    className="px-6 py-4 bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    PDF
                  </button>
                </div>
              </section>

              {/* AI Insights Example */}
              {diaryEntry.length > 50 && (
                <section className="bg-gradient-to-br from-[#A0D8E7]/20 to-[#C3B1E1]/20 rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-[#A0D8E7]/50">
                  <div className="flex items-center gap-3 mb-5">
                    <Brain className="w-7 h-7 text-[#3A5A98]" />
                    <h3 className="text-xl font-bold text-[#3A5A98]">💡 Insights da IA</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/70 p-5 rounded-2xl">
                      <h4 className="font-bold text-[#3A5A98] mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Gatilhos identificados
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-4 py-2 bg-[#B0EACD]/40 text-[#3A5A98] rounded-full text-sm font-bold">Trabalho</span>
                        <span className="px-4 py-2 bg-[#A0D8E7]/40 text-[#3A5A98] rounded-full text-sm font-bold">Pressão</span>
                        <span className="px-4 py-2 bg-[#C3B1E1]/40 text-[#3A5A98] rounded-full text-sm font-bold">Prazos</span>
                      </div>
                    </div>
                    <div className="bg-white/70 p-5 rounded-2xl">
                      <h4 className="font-bold text-[#3A5A98] mb-3 flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        Sugestão personalizada
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Percebi que você está se sentindo sobrecarregado com prazos. Isso é muito comum e você não está sozinho. Que tal fazer uma pausa agora e praticar a técnica de respiração 4-7-8? Ela pode ajudar a reduzir a pressão que você está sentindo.
                      </p>
                      <button
                        onClick={() => {
                          setCurrentView("exercises")
                          setSelectedExercise("4-7-8")
                        }}
                        className="mt-3 text-sm text-[#3A5A98] font-bold hover:underline flex items-center gap-1"
                      >
                        Fazer exercício agora <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="bg-white/70 p-5 rounded-2xl">
                      <h4 className="font-bold text-[#3A5A98] mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Padrão observado
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Nos últimos 7 dias, você mencionou "trabalho" 5 vezes como fonte de ansiedade. Considere conversar com alguém sobre isso ou buscar estratégias para gerenciar melhor essa área da sua vida.
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </div>
        )}

        {/* Exercises View */}
        {currentView === "exercises" && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => {
                  setCurrentView("home")
                  setSelectedExercise(null)
                }}
                className="text-[#3A5A98] hover:underline flex items-center gap-1 mb-4 font-medium"
              >
                ← Voltar
              </button>
              <h2 className="text-3xl font-bold text-[#3A5A98] mb-2">Exercícios Guiados</h2>
              <p className="text-gray-600">Escolha um exercício e deixe-se guiar. Tudo com instruções claras.</p>
            </div>

            {selectedExercise ? (
              <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-[#A0D8E7]/30">
                <button
                  onClick={() => {
                    setSelectedExercise(null)
                    setExerciseRunning(false)
                    setExerciseTimer(0)
                    setGroundingStep(0)
                  }}
                  className="text-[#3A5A98] hover:underline flex items-center gap-1 mb-6 font-medium"
                >
                  ← Voltar aos exercícios
                </button>
                
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-[#3A5A98] mb-4">
                    {exercises.find(e => e.id === selectedExercise)?.name}
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                    {exercises.find(e => e.id === selectedExercise)?.description}
                  </p>

                  {selectedExercise === "grounding" ? (
                    // Grounding 5-4-3-2-1 Interactive
                    <div className="max-w-2xl mx-auto">
                      <div className="mb-8">
                        <div className="flex justify-center gap-2 mb-6">
                          {groundingSteps.map((_, i) => (
                            <div
                              key={i}
                              className={`h-3 w-3 rounded-full transition-all ${
                                i <= groundingStep ? "bg-[#A0D8E7] scale-125" : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        
                        <div className="bg-gradient-to-br from-[#A0D8E7]/20 to-[#C3B1E1]/20 rounded-3xl p-8 border-2 border-[#A0D8E7]/30">
                          {(() => {
                            const step = groundingSteps[groundingStep]
                            const Icon = step.icon
                            return (
                              <>
                                <Icon className="w-16 h-16 text-[#3A5A98] mx-auto mb-4" />
                                <h4 className="text-2xl font-bold text-[#3A5A98] mb-4">{step.title}</h4>
                                <p className="text-gray-700 text-lg mb-6">{step.prompt}</p>
                                <div className="space-y-2 text-left">
                                  {step.examples.map((example, i) => (
                                    <div key={i} className="p-3 bg-white/60 rounded-xl text-gray-600 text-sm">
                                      • {example}
                                    </div>
                                  ))}
                                </div>
                              </>
                            )
                          })()}
                        </div>
                      </div>

                      <div className="flex gap-3 justify-center">
                        {groundingStep > 0 && (
                          <button
                            onClick={() => setGroundingStep(groundingStep - 1)}
                            className="px-8 py-4 bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 transition-all"
                          >
                            Anterior
                          </button>
                        )}
                        {groundingStep < groundingSteps.length - 1 ? (
                          <button
                            onClick={() => setGroundingStep(groundingStep + 1)}
                            className="px-8 py-4 bg-gradient-to-r from-[#A0D8E7] to-[#B0EACD] text-white rounded-full font-bold hover:shadow-2xl transition-all"
                          >
                            Próximo
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              alert("Exercício concluído! Como você está se sentindo agora? 💙")
                              setSelectedExercise(null)
                              setGroundingStep(0)
                            }}
                            className="px-8 py-4 bg-gradient-to-r from-[#B0EACD] to-[#A0D8E7] text-white rounded-full font-bold hover:shadow-2xl transition-all"
                          >
                            Concluir
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Timer-based exercises
                    <>
                      <div className={`w-72 h-72 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#A0D8E7] to-[#C3B1E1] flex items-center justify-center shadow-2xl transition-all duration-1000 ${
                        exerciseRunning ? getBreathingScale() : ""
                      }`}>
                        <div className="text-white text-center">
                          <div className="text-6xl font-bold mb-2">
                            {exerciseTimer > 0 ? formatTime(exerciseTimer) : "00:00"}
                          </div>
                          {exerciseRunning && (
                            <div className="text-lg opacity-90">
                              {selectedExercise?.includes("box") || selectedExercise?.includes("4-7-8") 
                                ? getBreathingText() 
                                : "Respire naturalmente"}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-4 justify-center mb-8">
                        {exerciseTimer === 0 ? (
                          <button
                            onClick={() => startExercise(exercises.find(e => e.id === selectedExercise)?.duration || 60)}
                            className="px-10 py-4 bg-gradient-to-r from-[#A0D8E7] to-[#B0EACD] text-white rounded-full font-bold hover:shadow-2xl transition-all flex items-center gap-2 text-lg"
                          >
                            <Play className="w-6 h-6" />
                            Iniciar
                          </button>
                        ) : (
                          <button
                            onClick={toggleExercise}
                            className="px-10 py-4 bg-gradient-to-r from-[#A0D8E7] to-[#B0EACD] text-white rounded-full font-bold hover:shadow-2xl transition-all flex items-center gap-2 text-lg"
                          >
                            {exerciseRunning ? (
                              <>
                                <Pause className="w-6 h-6" />
                                Pausar
                              </>
                            ) : (
                              <>
                                <Play className="w-6 h-6" />
                                Continuar
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Instructions */}
                      <div className="bg-[#A0D8E7]/10 rounded-2xl p-6 text-left max-w-xl mx-auto">
                        <h4 className="font-bold text-[#3A5A98] mb-3 text-lg">📋 Como fazer:</h4>
                        <ol className="space-y-2">
                          {exercises.find(e => e.id === selectedExercise)?.instructions.map((instruction, i) => (
                            <li key={i} className="text-sm text-gray-700 flex gap-2">
                              <span className="font-bold text-[#3A5A98]">{i + 1}.</span>
                              <span>{instruction}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {exerciseTimer === 0 && !exerciseRunning && selectedExercise && (
                        <div className="mt-8 p-6 bg-[#B0EACD]/20 rounded-2xl max-w-xl mx-auto">
                          <p className="text-[#3A5A98] font-bold mb-4 text-lg">Este exercício ajudou você?</p>
                          <div className="flex gap-3 justify-center">
                            <button 
                              onClick={() => alert("Ótimo! Vou recomendar mais exercícios assim para você. 💙")}
                              className="px-8 py-3 bg-[#B0EACD] text-white rounded-full hover:shadow-xl transition-all font-bold"
                            >
                              Sim, ajudou muito!
                            </button>
                            <button 
                              onClick={() => alert("Entendo. Vou sugerir outros exercícios que podem funcionar melhor para você.")}
                              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-all font-bold"
                            >
                              Não desta vez
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Breathing Exercises */}
                <section>
                  <div className="flex items-center gap-3 mb-5">
                    <Wind className="w-6 h-6 text-[#A0D8E7]" />
                    <h3 className="text-2xl font-bold text-[#3A5A98]">Respiração</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {exercises.filter(e => e.category === "Respiração").map(exercise => (
                      <button
                        key={exercise.id}
                        onClick={() => setSelectedExercise(exercise.id)}
                        className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#A0D8E7]/30 text-left group hover:scale-105"
                      >
                        <Wind className="w-10 h-10 text-[#A0D8E7] mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold text-[#3A5A98] mb-2 text-lg">{exercise.name}</h4>
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{exercise.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 font-medium flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {Math.floor(exercise.duration / 60)} min
                          </span>
                          <ChevronRight className="w-5 h-5 text-[#A0D8E7] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Meditation */}
                <section>
                  <div className="flex items-center gap-3 mb-5">
                    <Brain className="w-6 h-6 text-[#C3B1E1]" />
                    <h3 className="text-2xl font-bold text-[#3A5A98]">Meditação</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {exercises.filter(e => e.category === "Meditação").map(exercise => (
                      <button
                        key={exercise.id}
                        onClick={() => setSelectedExercise(exercise.id)}
                        className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#C3B1E1]/30 text-left group hover:scale-105"
                      >
                        <Brain className="w-10 h-10 text-[#C3B1E1] mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold text-[#3A5A98] mb-2 text-lg">{exercise.name}</h4>
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{exercise.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 font-medium flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {Math.floor(exercise.duration / 60)} min
                          </span>
                          <ChevronRight className="w-5 h-5 text-[#C3B1E1] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Crisis Techniques */}
                <section>
                  <div className="flex items-center gap-3 mb-5">
                    <Shield className="w-6 h-6 text-[#B0EACD]" />
                    <h3 className="text-2xl font-bold text-[#3A5A98]">Técnicas para Crises</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {exercises.filter(e => e.category === "Crise").map(exercise => (
                      <button
                        key={exercise.id}
                        onClick={() => setSelectedExercise(exercise.id)}
                        className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#B0EACD]/30 text-left group hover:scale-105"
                      >
                        <Shield className="w-10 h-10 text-[#B0EACD] mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold text-[#3A5A98] mb-2 text-lg">{exercise.name}</h4>
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{exercise.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 font-medium flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {Math.floor(exercise.duration / 60)} min
                          </span>
                          <ChevronRight className="w-5 h-5 text-[#B0EACD] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}
          </div>
        )}

        {/* Emergency View */}
        {currentView === "emergency" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-[#3A5A98] to-[#7B9CC9] rounded-3xl shadow-2xl p-8 sm:p-12 text-white text-center">
              <AlertCircle className="w-20 h-20 mx-auto mb-6 animate-pulse" />
              <h2 className="text-4xl font-bold mb-4">Você está seguro</h2>
              <p className="text-xl mb-3 leading-relaxed">
                Isso vai passar. Respire comigo.
              </p>
              <p className="text-lg mb-8 opacity-90">
                Vamos juntos, um passo de cada vez, no seu ritmo.
              </p>

              <div className="space-y-4 mb-8">
                <button
                  onClick={() => {
                    setCurrentView("exercises")
                    setSelectedExercise("box")
                  }}
                  className="w-full bg-white text-[#3A5A98] py-5 rounded-full font-bold hover:shadow-2xl transition-all text-lg hover:scale-105"
                >
                  🫁 Respiração de Emergência (Agora)
                </button>
                <button
                  onClick={() => {
                    setCurrentView("exercises")
                    setSelectedExercise("grounding")
                  }}
                  className="w-full bg-white/20 backdrop-blur-sm border-2 border-white py-5 rounded-full font-bold hover:bg-white/30 transition-all text-lg hover:scale-105"
                >
                  🧘 Técnica 5-4-3-2-1 (Grounding)
                </button>
                <button
                  onClick={() => setCurrentView("chat")}
                  className="w-full bg-white/20 backdrop-blur-sm border-2 border-white py-5 rounded-full font-bold hover:bg-white/30 transition-all text-lg hover:scale-105"
                >
                  💬 Conversar com Assistente
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-left border border-white/20">
                <h3 className="font-bold mb-4 text-center text-xl">💙 Lembre-se:</h3>
                <ul className="space-y-3 opacity-95 leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>Você está seguro neste momento</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>Isso é temporário e vai passar</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>Você já passou por isso antes e conseguiu</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>Respire devagar, você está no controle</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span>Não há nada de errado com você</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setCurrentView("home")}
                className="mt-8 text-white/90 hover:text-white underline font-medium text-lg"
              >
                Voltar ao início
              </button>
            </div>
          </div>
        )}

        {/* Chat View */}
        {currentView === "chat" && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setCurrentView("home")}
                className="text-[#3A5A98] hover:underline flex items-center gap-1 mb-4 font-medium"
              >
                ← Voltar
              </button>
              <h2 className="text-3xl font-bold text-[#3A5A98] mb-2">Médico Amigo</h2>
              <p className="text-gray-600">Converse com nosso assistente de triagem emocional. Sem julgamentos, apenas acolhimento.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl border-2 border-[#A0D8E7]/30 overflow-hidden">
              <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-[#A0D8E7]/5 to-white">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A0D8E7] to-[#C3B1E1] flex items-center justify-center flex-shrink-0 shadow-lg">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className={`rounded-2xl p-4 max-w-[80%] shadow-md ${
                      msg.role === 'assistant' 
                        ? 'bg-[#A0D8E7]/20 rounded-tl-none border border-[#A0D8E7]/30' 
                        : 'bg-gradient-to-r from-[#3A5A98] to-[#7B9CC9] text-white rounded-tr-none'
                    }`}>
                      <p className={msg.role === 'assistant' ? 'text-gray-800' : 'text-white'}>
                        {msg.content}
                      </p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-[#A0D8E7]/30 p-4 bg-gray-50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-5 py-4 rounded-full border-2 border-[#A0D8E7]/30 focus:outline-none focus:border-[#A0D8E7] transition-colors"
                  />
                  <button 
                    onClick={handleChatSend}
                    className="px-8 py-4 bg-gradient-to-r from-[#A0D8E7] to-[#C3B1E1] text-white rounded-full font-bold hover:shadow-xl transition-all"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar View */}
        {currentView === "calendar" && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setCurrentView("home")}
                className="text-[#3A5A98] hover:underline flex items-center gap-1 mb-4 font-medium"
              >
                ← Voltar
              </button>
              <h2 className="text-3xl font-bold text-[#3A5A98] mb-2">Calendário Emocional</h2>
              <p className="text-gray-600">Visualize seus padrões e evolução ao longo do tempo</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6 border-2 border-[#A0D8E7]/30">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#3A5A98]">Janeiro 2025</h3>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">←</button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">→</button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="text-center text-sm font-bold text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                  {[...Array(31)].map((_, i) => {
                    const colors = ['bg-[#B0EACD]', 'bg-[#A0D8E7]', 'bg-[#C3B1E1]', 'bg-[#7B9CC9]', 'bg-gray-100']
                    const randomColor = colors[Math.floor(Math.random() * colors.length)]
                    return (
                      <button
                        key={i}
                        className={`aspect-square rounded-xl ${randomColor} hover:scale-110 transition-all flex items-center justify-center text-sm font-bold shadow-sm hover:shadow-lg`}
                      >
                        {i + 1}
                      </button>
                    )
                  }))}
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-[#B0EACD]/30">
                  <h3 className="text-xl font-bold text-[#3A5A98] mb-5">Estatísticas</h3>
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600 font-medium">Dias tranquilos</span>
                        <span className="text-sm font-bold text-[#3A5A98]">18 dias</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#B0EACD] to-[#A0D8E7] w-[60%] rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600 font-medium">Dias ansiosos</span>
                        <span className="text-sm font-bold text-[#3A5A98]">8 dias</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#7B9CC9] to-[#3A5A98] w-[27%] rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600 font-medium">Média de ansiedade</span>
                        <span className="text-sm font-bold text-[#3A5A98]">4.2/10</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#C3B1E1] to-[#A0D8E7] w-[42%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#A0D8E7]/20 to-[#C3B1E1]/20 rounded-3xl shadow-xl p-6 border-2 border-[#A0D8E7]/50">
                  <div className="flex items-start gap-3">
                    <Brain className="w-7 h-7 text-[#3A5A98] mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-[#3A5A98] mb-3 text-lg">💡 Insight da IA</h4>
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">
                        Percebi que sua ansiedade tende a aumentar às terças e quintas-feiras. Isso pode estar relacionado ao trabalho ou compromissos específicos desses dias?
                      </p>
                      <p className="text-xs text-gray-600">
                        Considere planejar exercícios de respiração preventivos nesses dias.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-[#C3B1E1]/30">
                  <h4 className="font-bold text-[#3A5A98] mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Conquistas
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-[#B0EACD]/20 rounded-xl">
                      <span className="text-2xl">🏆</span>
                      <div>
                        <div className="text-sm font-bold text-[#3A5A98]">7 dias seguidos</div>
                        <div className="text-xs text-gray-600">Registrando emoções</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#A0D8E7]/20 rounded-xl">
                      <span className="text-2xl">⭐</span>
                      <div>
                        <div className="text-sm font-bold text-[#3A5A98]">20+ exercícios</div>
                        <div className="text-xs text-gray-600">Cuidando de você</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-md border-t border-[#A0D8E7]/30 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-[#3A5A98]" />
            <p className="text-gray-700 font-medium">
              Serenar - Sua ferramenta de autocuidado no bolso
            </p>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Feito com carinho para quem busca leveza, clareza e paz. Um passo de cada vez, no seu ritmo. 💙
          </p>
        </div>
      </footer>
    </div>
  )
}
