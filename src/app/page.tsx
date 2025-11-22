"use client"

import { useState, useEffect } from "react"
import { Heart, BookOpen, TrendingUp, Wind, Shield, MessageCircle, Calendar, BarChart3, Sparkles, Menu, X, AlertCircle, Award, Users, Play, CheckCircle, Brain, Phone, Download, ChevronRight, Clock, Target, Zap, Send, ThumbsUp, User, Edit, Camera, Upload } from "lucide-react"
import { supabase } from "@/lib/supabase"

type MoodEntry = {
  date: string
  mood: string
  anxiety: number
  triggers: string[]
  symptoms: string[]
  notes: string
  time: string
}

type Exercise = {
  id: string
  name: string
  duration: string
  description: string
  type: "breathing" | "meditation" | "grounding" | "cognitive"
  worked?: boolean
  steps?: string[]
}

type ChatMessage = {
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

type CommunityPost = {
  id: string
  user: string
  avatar: string
  message: string
  likes: number
  time: string
  comments: CommunityComment[]
  userProfile?: {
    frequency?: string
    goals?: string[]
  }
}

type CommunityComment = {
  id: string
  user: string
  avatar: string
  message: string
  time: string
}

type UserProfileType = {
  name: string
  age: number
  frequency: string
  symptoms: string[]
  moments: string[]
  professional: string
  goals: string[]
  photo?: string
}

type QuickQuestion = {
  id: string
  text: string
  category: "anxiety" | "racing-thoughts" | "fear" | "depression"
  exercises: string[]
}

// Função para gerar UUID válido
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export default function Home() {
  // Estado do Splash Screen
  const [showSplash, setShowSplash] = useState(true)
  const [splashFadeOut, setSplashFadeOut] = useState(false)

  // Estado do Onboarding
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(1)
  const [onboardingData, setOnboardingData] = useState({
    name: "",
    age: "",
    frequency: "",
    symptoms: [] as string[],
    professional: "",
    goals: [] as string[]
  })

  // Estados principais
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null)
  const [userId, setUserId] = useState<string>("")
  
  // Estados do perfil
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: "",
    age: 18,
    frequency: "",
    symptoms: [] as string[],
    moments: [] as string[],
    professional: "",
    goals: [] as string[],
    photo: ""
  })
  
  const [selectedMood, setSelectedMood] = useState<string>("")
  const [anxietyLevel, setAnxietyLevel] = useState(5)
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([])
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [quickNotes, setQuickNotes] = useState("")
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [canFillAnamnesis, setCanFillAnamnesis] = useState(true)
  const [lastAnamnesisDate, setLastAnamnesisDate] = useState<string | null>(null)
  
  const [diaryEntry, setDiaryEntry] = useState("")
  const [diaryInsights, setDiaryInsights] = useState<string[]>([])
  const [showDiaryAnalysis, setShowDiaryAnalysis] = useState(false)
  
  const [breathingActive, setBreathingActive] = useState(false)
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [breathCount, setBreathCount] = useState(0)
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [exerciseStep, setExerciseStep] = useState(0)
  const [exerciseActive, setExerciseActive] = useState(false)
  
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { text: "Olá! Sou seu Médico Amigo. Estou aqui para ajudar você a entender o que está sentindo. Como posso te apoiar agora?", sender: "ai", timestamp: new Date() }
  ])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  
  const [showEmergency, setShowEmergency] = useState(false)
  const [emergencyStep, setEmergencyStep] = useState(0)
  const [emergencyBreathing, setEmergencyBreathing] = useState(false)
  
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentView, setCurrentView] = useState<"home" | "calendar" | "exercises" | "community" | "learning">("home")
  
  const [streak, setStreak] = useState(7)
  const [achievements, setAchievements] = useState([
    { name: "Primeira Semana", unlocked: true, icon: "🌱" },
    { name: "10 Exercícios Completos", unlocked: true, icon: "💪" },
    { name: "Autoconsciência Nível 2", unlocked: false, icon: "🧠" },
    { name: "30 Dias de Jornada", unlocked: false, icon: "🏆" }
  ])

  const [weeklyPlan, setWeeklyPlan] = useState([
    { activity: "Caminhadas leves", target: 3, completed: 2, icon: "🚶" },
    { activity: "Meditações guiadas", target: 2, completed: 1, icon: "🧘‍♂️" },
    { activity: "Diário emocional", target: 1, completed: 1, icon: "📝" },
    { activity: "Exercícios de respiração", target: 2, completed: 2, icon: "🫁" },
    { activity: "Higiene do sono", target: 1, completed: 0, icon: "😴" }
  ])

  // Estados da Comunidade
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([
    { 
      id: "1",
      user: "Anônimo", 
      avatar: "A",
      message: "Hoje consegui controlar uma crise usando a respiração 4-7-8. Obrigado, Serenar!", 
      likes: 24, 
      time: "2h atrás",
      comments: [
        { id: "c1", user: "Anônimo", avatar: "B", message: "Parabéns! Você é forte! 💪", time: "1h atrás" },
        { id: "c2", user: "Anônimo", avatar: "C", message: "Que inspiração! Continue assim!", time: "30min atrás" }
      ],
      userProfile: { frequency: "Diariamente", goals: ["Controlar crises", "Dormir melhor"] }
    },
    { 
      id: "2",
      user: "Anônimo", 
      avatar: "B",
      message: "Alguém mais sente ansiedade ao acordar? Como vocês lidam?", 
      likes: 12, 
      time: "5h atrás",
      comments: [
        { id: "c3", user: "Anônimo", avatar: "D", message: "Sim! Eu faço meditação logo ao acordar e ajuda muito.", time: "4h atrás" }
      ],
      userProfile: { frequency: "Algumas vezes por semana", goals: ["Entender meus gatilhos"] }
    },
    { 
      id: "3",
      user: "Anônimo", 
      avatar: "C",
      message: "3 semanas sem crises! A jornada é longa, mas estamos juntos.", 
      likes: 45, 
      time: "1 dia atrás",
      comments: [],
      userProfile: { frequency: "Raramente", goals: ["Ter mais paz no dia a dia"] }
    },
    { 
      id: "4",
      user: "Anônimo", 
      avatar: "D",
      message: "O exercício de grounding 5-4-3-2-1 salvou meu dia hoje. Recomendo!", 
      likes: 18, 
      time: "2 dias atrás",
      comments: [
        { id: "c4", user: "Anônimo", avatar: "E", message: "Vou tentar também! Obrigado pela dica.", time: "1 dia atrás" }
      ],
      userProfile: { frequency: "Diariamente", goals: ["Reduzir pensamentos acelerados"] }
    }
  ])
  const [newPostText, setNewPostText] = useState("")
  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const [newCommentText, setNewCommentText] = useState("")

  // Perguntas prontas para o Médico Amigo
  const quickQuestions: QuickQuestion[] = [
    {
      id: "1",
      text: "Estou com ansiedade agora",
      category: "anxiety",
      exercises: ["1", "2", "3", "4"]
    },
    {
      id: "2",
      text: "Minha mente está acelerada",
      category: "racing-thoughts",
      exercises: ["5", "6", "9"]
    },
    {
      id: "3",
      text: "Estou com medo",
      category: "fear",
      exercises: ["7", "8", "10"]
    },
    {
      id: "4",
      text: "Me sinto deprimido",
      category: "depression",
      exercises: ["5", "6", "10"]
    }
  ]

  // Efeito do Splash Screen
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setSplashFadeOut(true)
    }, 2000)

    const hideTimer = setTimeout(() => {
      setShowSplash(false)
      // Verificar se precisa mostrar onboarding
      checkNeedOnboarding()
    }, 3000)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  // Verificar se usuário precisa fazer onboarding
  const checkNeedOnboarding = async () => {
    let storedUserId = localStorage.getItem('serenar_user_id')
    
    if (!storedUserId) {
      // Novo usuário - gerar UUID válido
      storedUserId = generateUUID()
      localStorage.setItem('serenar_user_id', storedUserId)
      setUserId(storedUserId)
      setShowOnboarding(true)
    } else {
      // Usuário existente - verificar se tem perfil
      setUserId(storedUserId)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', storedUserId)
        .single()
      
      if (data && !error) {
        // Perfil existe - carregar dados
        setUserProfile({
          name: data.name || "Usuário",
          age: parseInt(data.idade) || 25,
          frequency: data.frequencia_crises || "Algumas vezes por semana",
          symptoms: data.sintomas_principais || [],
          moments: [],
          professional: data.tratamento_atual || "Não",
          goals: [],
          photo: ""
        })
        await checkLastAnamnesis(storedUserId)
      } else {
        // Perfil não existe - mostrar onboarding
        setShowOnboarding(true)
      }
    }
  }

  // Verificar se pode preencher anamnese hoje
  const checkLastAnamnesis = async (uid: string) => {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('daily_anamnesis')
      .select('date')
      .eq('user_id', uid)
      .eq('date', today)
      .single()
    
    if (data && !error) {
      setCanFillAnamnesis(false)
      setLastAnamnesisDate(data.date)
    } else {
      setCanFillAnamnesis(true)
      setLastAnamnesisDate(null)
    }
  }

  // Salvar perfil do onboarding
  const saveOnboardingProfile = async () => {
    if (!onboardingData.name.trim()) {
      alert("Por favor, preencha seu nome.")
      return
    }

    if (!onboardingData.age || parseInt(onboardingData.age) < 1) {
      alert("Por favor, preencha sua idade.")
      return
    }

    if (!onboardingData.frequency) {
      alert("Por favor, selecione a frequência da ansiedade.")
      return
    }

    // Salvar no Supabase
    const { error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        name: onboardingData.name,
        idade: onboardingData.age,
        frequencia_crises: onboardingData.frequency,
        sintomas_principais: onboardingData.symptoms,
        tratamento_atual: onboardingData.professional,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (!error) {
      // Criar perfil local
      setUserProfile({
        name: onboardingData.name,
        age: parseInt(onboardingData.age),
        frequency: onboardingData.frequency,
        symptoms: onboardingData.symptoms,
        moments: [],
        professional: onboardingData.professional,
        goals: onboardingData.goals,
        photo: ""
      })
      
      setShowOnboarding(false)
      await checkLastAnamnesis(userId)
    } else {
      alert("❌ Erro ao salvar perfil. Tente novamente.")
      console.error(error)
    }
  }

  // Dados para monitoramento
  const moods = [
    { emoji: "😊", label: "Tranquilo", color: "bg-[#B0EACD]", value: 2 },
    { emoji: "😌", label: "Calmo", color: "bg-[#A0D8E7]", value: 4 },
    { emoji: "😐", label: "Neutro", color: "bg-[#C3B1E1]", value: 5 },
    { emoji: "😟", label: "Ansioso", color: "bg-[#3A5A98] text-white", value: 7 },
    { emoji: "😰", label: "Muito ansioso", color: "bg-[#3A5A98] text-white", value: 9 },
  ]

  const triggers = ["Trabalho", "Relacionamentos", "Saúde", "Finanças", "Família", "Futuro", "Outro"]
  const symptoms = ["Coração acelerado", "Respiração difícil", "Tensão muscular", "Pensamentos rápidos", "Inquietação", "Fadiga"]

  // Exercícios disponíveis com passos detalhados
  const exercises: Exercise[] = [
    { 
      id: "1", 
      name: "Respiração 4-7-8", 
      duration: "2 min", 
      description: "Inspire por 4s, segure por 7s, expire por 8s", 
      type: "breathing",
      steps: [
        "Encontre uma posição confortável",
        "Inspire pelo nariz contando até 4",
        "Segure a respiração contando até 7",
        "Expire pela boca contando até 8",
        "Repita por 4 ciclos completos"
      ]
    },
    { 
      id: "2", 
      name: "Respiração Quadrada", 
      duration: "3 min", 
      description: "4 segundos para cada fase: inspire, segure, expire, segure", 
      type: "breathing",
      steps: [
        "Sente-se confortavelmente",
        "Inspire contando até 4",
        "Segure a respiração por 4",
        "Expire lentamente por 4",
        "Pause por 4 segundos",
        "Repita por 5 ciclos"
      ]
    },
    { 
      id: "3", 
      name: "Coerência Cardíaca", 
      duration: "5 min", 
      description: "Respiração ritmada para equilibrar o sistema nervoso", 
      type: "breathing",
      steps: [
        "Respire de forma suave e profunda",
        "Inspire por 5 segundos",
        "Expire por 5 segundos",
        "Mantenha o ritmo constante",
        "Continue por 5 minutos"
      ]
    },
    { 
      id: "4", 
      name: "Respiração Anti-Pânico", 
      duration: "2 min", 
      description: "Técnica rápida para momentos de crise intensa", 
      type: "breathing",
      steps: [
        "Expire completamente primeiro",
        "Inspire lentamente pelo nariz",
        "Expire devagar pela boca",
        "Foque apenas na respiração",
        "Repita até se sentir mais calmo"
      ]
    },
    { 
      id: "5", 
      name: "Meditação Guiada 1min", 
      duration: "1 min", 
      description: "Pausa rápida para centrar a mente", 
      type: "meditation",
      steps: [
        "Feche os olhos suavemente",
        "Observe sua respiração natural",
        "Deixe os pensamentos passarem",
        "Volte ao momento presente",
        "Abra os olhos quando estiver pronto"
      ]
    },
    { 
      id: "6", 
      name: "Meditação Guiada 5min", 
      duration: "5 min", 
      description: "Relaxamento profundo e consciência plena", 
      type: "meditation",
      steps: [
        "Encontre um lugar tranquilo",
        "Relaxe cada parte do corpo",
        "Observe sua respiração",
        "Aceite pensamentos sem julgamento",
        "Permaneça no presente"
      ]
    },
    { 
      id: "7", 
      name: "Grounding 5-4-3-2-1", 
      duration: "3 min", 
      description: "Técnica sensorial para voltar ao presente", 
      type: "grounding",
      steps: [
        "5 coisas que você VÊ ao seu redor",
        "4 coisas que você pode TOCAR",
        "3 sons que você OUVE",
        "2 coisas que você pode CHEIRAR",
        "1 coisa que você pode SABOREAR"
      ]
    },
    { 
      id: "8", 
      name: "Relaxamento Muscular", 
      duration: "10 min", 
      description: "Tensione e relaxe grupos musculares progressivamente", 
      type: "grounding",
      steps: [
        "Comece pelos pés",
        "Tensione o músculo por 5 segundos",
        "Relaxe completamente por 10 segundos",
        "Suba gradualmente pelo corpo",
        "Termine com o rosto e cabeça"
      ]
    },
    { 
      id: "9", 
      name: "Reestruturação de Pensamentos", 
      duration: "5 min", 
      description: "Questione e transforme pensamentos ansiosos", 
      type: "cognitive",
      steps: [
        "Identifique o pensamento ansioso",
        "Questione: isso é realmente verdade?",
        "Busque evidências contra o pensamento",
        "Crie um pensamento alternativo realista",
        "Pratique o novo pensamento"
      ]
    },
    { 
      id: "10", 
      name: "Cartões de Enfrentamento", 
      duration: "2 min", 
      description: "Frases que acalmam e fortalecem", 
      type: "cognitive",
      steps: [
        "Eu estou seguro agora",
        "Isso vai passar, sempre passa",
        "Eu já superei isso antes",
        "Posso lidar com isso, um passo de cada vez",
        "Meus sentimentos são válidos"
      ]
    }
  ]

  // Efeito de respiração guiada
  useEffect(() => {
    if (breathingActive) {
      const phases = ["inhale", "hold", "exhale"] as const
      const durations = { inhale: 4000, hold: 7000, exhale: 8000 }
      
      const timer = setInterval(() => {
        setBreathPhase(prev => {
          const currentIndex = phases.indexOf(prev)
          const nextIndex = (currentIndex + 1) % phases.length
          return phases[nextIndex]
        })
        setBreathCount(prev => prev + 1)
      }, durations[breathPhase])

      return () => clearInterval(timer)
    }
  }, [breathingActive, breathPhase])

  // Efeito de respiração de emergência
  useEffect(() => {
    if (emergencyBreathing) {
      const timer = setInterval(() => {
        setBreathPhase(prev => prev === "inhale" ? "exhale" : "inhale")
      }, 4000)

      return () => clearInterval(timer)
    }
  }, [emergencyBreathing])

  // Funções do Perfil
  const openProfileEdit = () => {
    if (userProfile) {
      setProfileForm({
        name: userProfile.name,
        age: userProfile.age,
        frequency: userProfile.frequency,
        symptoms: userProfile.symptoms,
        moments: userProfile.moments,
        professional: userProfile.professional,
        goals: userProfile.goals,
        photo: userProfile.photo || ""
      })
      setShowProfileEdit(true)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileForm({ ...profileForm, photo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const saveProfile = async () => {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        name: profileForm.name,
        idade: profileForm.age.toString(),
        frequencia_crises: profileForm.frequency,
        sintomas_principais: profileForm.symptoms,
        tratamento_atual: profileForm.professional,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
    
    if (!error) {
      setUserProfile({
        name: profileForm.name,
        age: profileForm.age,
        frequency: profileForm.frequency,
        symptoms: profileForm.symptoms,
        moments: profileForm.moments,
        professional: profileForm.professional,
        goals: profileForm.goals,
        photo: profileForm.photo
      })
      setShowProfileEdit(false)
      alert("✅ Perfil atualizado com sucesso!")
    } else {
      alert("❌ Erro ao atualizar perfil. Tente novamente.")
    }
  }

  // Funções de Monitoramento
  const saveMoodEntry = async () => {
    if (!selectedMood) {
      alert("Por favor, selecione seu humor antes de salvar.")
      return
    }

    if (!canFillAnamnesis) {
      alert("💙 Você já preencheu a anamnese hoje! Volte amanhã para um novo registro. Isso evita que você fique preocupado demais com os registros.")
      return
    }

    const today = new Date().toISOString().split('T')[0]
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

    // Salvar no Supabase
    const { error } = await supabase
      .from('daily_anamnesis')
      .insert({
        user_id: userId,
        date: today,
        mood: selectedMood,
        anxiety_level: anxietyLevel,
        triggers: selectedTriggers,
        symptoms: selectedSymptoms,
        notes: quickNotes,
        time: time
      })

    if (!error) {
      const entry: MoodEntry = {
        date: new Date().toISOString(),
        mood: selectedMood,
        anxiety: anxietyLevel,
        triggers: selectedTriggers,
        symptoms: selectedSymptoms,
        notes: quickNotes,
        time: time
      }
      
      const newEntries = [...moodEntries, entry]
      setMoodEntries(newEntries)
      
      // Reset
      setSelectedMood("")
      setAnxietyLevel(5)
      setSelectedTriggers([])
      setSelectedSymptoms([])
      setQuickNotes("")
      
      // Marcar que já preencheu hoje
      setCanFillAnamnesis(false)
      setLastAnamnesisDate(today)
      
      // Alerta inteligente se ansiedade alta por 3 dias
      const recentEntries = newEntries.slice(-3)
      if (recentEntries.length === 3 && recentEntries.every(e => e.anxiety >= 7)) {
        setTimeout(() => {
          alert("💙 Percebi que sua ansiedade está alta nos últimos 3 dias. Que tal fazer uma pausa e respirar? Se isso continuar, considere buscar apoio profissional. Você não está sozinho.")
        }, 500)
      }

      alert("✅ Registro salvo! Você está cuidando de si mesmo. Continue assim!")
    } else {
      alert("❌ Erro ao salvar registro. Tente novamente.")
    }
  }

  // Funções do Diário
  const analyzeDiary = () => {
    if (!diaryEntry.trim()) {
      alert("Por favor, escreva algo no diário antes de analisar.")
      return
    }
    
    // Simulação de análise de IA mais inteligente
    const keywords = diaryEntry.toLowerCase()
    const insights = []
    
    if (keywords.includes('trabalho') || keywords.includes('emprego')) {
      insights.push("💼 Identifiquei que você menciona 'trabalho' - pode ser um gatilho importante para explorarmos")
    }
    
    if (keywords.includes('noite') || keywords.includes('dormir')) {
      insights.push("🌙 Seus registros mostram preocupação com o período noturno - vamos trabalhar técnicas de higiene do sono")
    }
    
    if (keywords.includes('preocup') || keywords.includes('tens') || keywords.includes('ansi')) {
      insights.push("🧠 Você tem usado palavras como 'preocupado' e 'tenso' - vamos praticar técnicas de relaxamento")
    }
    
    if (keywords.includes('reunião') || keywords.includes('apresent')) {
      insights.push("📊 Padrão detectado: ansiedade aumenta em situações de exposição - isso é muito comum")
    }

    if (insights.length === 0) {
      insights.push("✨ Continue registrando seus sentimentos. Quanto mais você escreve, melhor consigo te ajudar a identificar padrões")
      insights.push("💚 Lembre-se: escrever sobre o que sentimos já é um ato de autocuidado poderoso")
    }
    
    setDiaryInsights(insights)
    setShowDiaryAnalysis(true)
  }

  const exportDiaryPDF = () => {
    if (!diaryEntry.trim() && moodEntries.length === 0) {
      alert("Você precisa ter registros no diário ou monitoramento para exportar o relatório.")
      return
    }

    // Simulação de exportação
    const report = `
📄 RELATÓRIO EMOCIONAL - SERENAR

📅 Período: ${new Date().toLocaleDateString('pt-BR')}
👤 Perfil: ${userProfile?.name || 'Em construção'} (${userProfile?.frequency || 'Frequência não definida'})

📊 RESUMO DE HUMOR:
${moodEntries.slice(-7).map(e => `• ${e.date.split('T')[0]}: ${e.mood} (Ansiedade: ${e.anxiety}/10)`).join('\n')}

🎯 PRINCIPAIS GATILHOS:
${[...new Set(moodEntries.flatMap(e => e.triggers))].join(', ') || 'Ainda coletando dados'}

💭 SINTOMAS FREQUENTES:
${[...new Set(moodEntries.flatMap(e => e.symptoms))].join(', ') || 'Ainda coletando dados'}

📝 DIÁRIO EMOCIONAL:
${diaryEntry || 'Nenhuma entrada recente'}

💡 RECOMENDAÇÕES:
• Continue registrando diariamente
• Pratique exercícios de respiração
• Mantenha rotina de sono regular
• Considere apoio profissional se necessário

---
Gerado por Serenar - Seu companheiro de bem-estar
    `
    
    console.log(report)
    alert("✅ Relatório PDF gerado com sucesso!\n\nInclui: humor, sintomas, ciclos de ansiedade, principais gatilhos e recomendações personalizadas.\n\n(Em um app real, o PDF seria baixado automaticamente)")
  }

  // Função para lidar com perguntas prontas
  const handleQuickQuestion = (question: QuickQuestion) => {
    // Adicionar a pergunta como mensagem do usuário
    const userMessage: ChatMessage = { 
      text: question.text, 
      sender: "user", 
      timestamp: new Date() 
    }
    setChatMessages(prev => [...prev, userMessage])
    setIsTyping(true)
    
    // Resposta contextual baseada na categoria
    setTimeout(() => {
      let response = ""
      let exerciseNames: string[] = []
      
      // Buscar nomes dos exercícios recomendados
      question.exercises.forEach(exId => {
        const ex = exercises.find(e => e.id === exId)
        if (ex) exerciseNames.push(ex.name)
      })
      
      switch (question.category) {
        case "anxiety":
          response = `Entendo que você está sentindo ansiedade agora. Primeiro, saiba que você está seguro e isso vai passar. Vamos trabalhar juntos para acalmar seu corpo e mente.\n\n💙 Recomendo começar com:\n• ${exerciseNames.slice(0, 3).join('\n• ')}\n\nQuer que eu te guie em um desses exercícios? Ou prefere conversar mais sobre o que está sentindo?`
          break
        case "racing-thoughts":
          response = `Pensamentos acelerados podem ser muito desconfortáveis. Vamos desacelerar juntos, um passo de cada vez.\n\n🧠 Exercícios que podem ajudar:\n• ${exerciseNames.join('\n• ')}\n\nVocê também pode me contar o que está passando pela sua cabeça. Às vezes, colocar em palavras já ajuda a organizar os pensamentos.`
          break
        case "fear":
          response = `O medo é uma emoção válida e você não está sozinho. Vamos trabalhar técnicas para te trazer de volta ao momento presente, onde você está seguro.\n\n🛡️ Técnicas recomendadas:\n• ${exerciseNames.join('\n• ')}\n\nO que você está sentindo medo agora? Quer conversar sobre isso?`
          break
        case "depression":
          response = `Percebo que você está se sentindo para baixo. Seus sentimentos são válidos e é corajoso buscar ajuda. Vamos juntos, com calma e sem pressa.\n\n💚 Práticas que podem ajudar:\n• ${exerciseNames.join('\n• ')}\n\nLembre-se: você não está sozinho. Se esses sentimentos persistirem, considere buscar apoio profissional. Quer conversar mais sobre como você está se sentindo?`
          break
      }
      
      const aiMessage: ChatMessage = { 
        text: response, 
        sender: "ai", 
        timestamp: new Date() 
      }
      setChatMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
      
      // Adicionar botões de ação para ir aos exercícios
      setTimeout(() => {
        const actionMessage: ChatMessage = {
          text: "💡 Você pode acessar esses exercícios na aba 'Exercícios' do menu principal. Quer que eu te ajude com algo mais?",
          sender: "ai",
          timestamp: new Date()
        }
        setChatMessages(prev => [...prev, actionMessage])
      }, 1000)
    }, 1500)
  }

  // Funções de Chat com IA mais inteligente
  const sendChatMessage = () => {
    if (!chatInput.trim()) return
    
    const userMessage: ChatMessage = { 
      text: chatInput, 
      sender: "user", 
      timestamp: new Date() 
    }
    setChatMessages(prev => [...prev, userMessage])
    setChatInput("")
    setIsTyping(true)
    
    // Resposta inteligente baseada no contexto
    setTimeout(() => {
      const input = chatInput.toLowerCase()
      let response = ""
      
      // Respostas contextuais
      if (input.includes('crise') || input.includes('pânico') || input.includes('desespero')) {
        response = "Entendo que você está passando por um momento difícil agora. Primeiro, vamos respirar juntos. Você está seguro. Que tal tentarmos o exercício de respiração anti-pânico? Ele pode ajudar a acalmar rapidamente."
      } else if (input.includes('dormir') || input.includes('insônia') || input.includes('sono')) {
        response = "Problemas com sono são muito comuns em quem tem ansiedade. Vamos trabalhar isso juntos. Recomendo: evitar telas 1h antes de dormir, criar uma rotina relaxante e tentar a meditação guiada de 5 minutos antes de deitar."
      } else if (input.includes('trabalho') || input.includes('emprego') || input.includes('chefe')) {
        response = "O ambiente de trabalho pode ser um grande gatilho de ansiedade. Isso é muito comum. Que tal identificarmos especificamente o que te deixa mais ansioso no trabalho? Podemos trabalhar técnicas específicas para essas situações."
      } else if (input.includes('sozinho') || input.includes('ninguém') || input.includes('isolado')) {
        response = "Você não está sozinho, eu estou aqui com você. E saiba que milhões de pessoas passam pelo que você está passando. Seus sentimentos são válidos. Quer conversar mais sobre o que está sentindo?"
      } else if (input.includes('melhor') || input.includes('bem') || input.includes('obrigad')) {
        response = "Fico muito feliz em saber que você está se sentindo melhor! Isso é um grande passo. Continue cuidando de si mesmo. Lembre-se: você é mais forte do que imagina. 💙"
      } else if (input.includes('ajuda') || input.includes('não sei') || input.includes('como')) {
        response = "Estou aqui para te ajudar. Vamos juntos, um passo de cada vez. Que tal começarmos identificando o que você está sentindo agora? Isso pode ser: ansiedade, medo, tristeza, tensão... O que mais se aproxima?"
      } else if (input.includes('respiração') || input.includes('respirar')) {
        response = "Ótima escolha! A respiração é uma ferramenta poderosa. Recomendo começar com a Respiração 4-7-8 ou a Respiração Quadrada. Ambas são muito eficazes para acalmar o sistema nervoso. Quer que eu te guie?"
      } else {
        // Respostas gerais empáticas
        const generalResponses = [
          "Entendo como você está se sentindo. Isso é muito comum e você não está sozinho. Seus sentimentos são válidos.",
          "Percebo que você está passando por um momento difícil. Vamos juntos, um passo de cada vez. O que você está sentindo agora?",
          "Seus sentimentos são importantes. Quer me contar mais sobre o que está acontecendo? Estou aqui para ouvir sem julgamentos.",
          "Lembre-se: você está seguro agora. Vamos focar no presente juntos. Que tal tentarmos um exercício de respiração?",
          "É corajoso buscar ajuda e falar sobre o que sente. Isso já é um grande passo. Como posso te apoiar melhor agora?"
        ]
        response = generalResponses[Math.floor(Math.random() * generalResponses.length)]
      }
      
      const aiMessage: ChatMessage = { 
        text: response, 
        sender: "ai", 
        timestamp: new Date() 
      }
      setChatMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  // Funções de Exercícios
  const startExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise)
    setExerciseStep(0)
    setExerciseActive(true)
  }

  const nextExerciseStep = () => {
    if (selectedExercise && exerciseStep < (selectedExercise.steps?.length || 0) - 1) {
      setExerciseStep(exerciseStep + 1)
    } else {
      completeExercise()
    }
  }

  const completeExercise = () => {
    setExerciseActive(false)
    alert("🎉 Parabéns! Você completou o exercício. Como você se sente agora? Marque se funcionou para você!")
  }

  const markExerciseWorked = (exerciseId: string, worked: boolean) => {
    alert(worked 
      ? "✅ Ótimo! Vou recomendar mais exercícios como este para você." 
      : "📝 Entendi. Vou sugerir outras técnicas que podem funcionar melhor para você."
    )
  }

  // Funções de Emergência
  const emergencySteps = [
    { 
      message: "Você está seguro agora", 
      action: "Respire comigo",
      description: "Vamos começar respirando juntos. Inspire devagar..."
    },
    { 
      message: "Isso vai passar", 
      action: "Vamos fazer grounding",
      description: "Olhe ao redor. Nomeie 5 coisas que você vê..."
    },
    { 
      message: "Você não está sozinho", 
      action: "Estou aqui com você",
      description: "Você está indo muito bem. Continue respirando..."
    }
  ]

  const startEmergencyBreathing = () => {
    setEmergencyBreathing(true)
    setTimeout(() => setEmergencyBreathing(false), 60000) // 1 minuto
  }

  // Funções da Comunidade
  const createPost = () => {
    if (!newPostText.trim()) {
      alert("Por favor, escreva algo antes de compartilhar.")
      return
    }

    const newPost: CommunityPost = {
      id: Date.now().toString(),
      user: "Você",
      avatar: userProfile?.name?.[0] || "V",
      message: newPostText,
      likes: 0,
      time: "Agora",
      comments: [],
      userProfile: userProfile || undefined
    }

    setCommunityPosts([newPost, ...communityPosts])
    setNewPostText("")
    alert("✅ Sua história foi compartilhada! Obrigado por contribuir com a comunidade. 💙")
  }

  const likePost = (postId: string) => {
    setCommunityPosts(posts => 
      posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    )
  }

  const addComment = (postId: string) => {
    if (!newCommentText.trim()) {
      alert("Por favor, escreva um comentário.")
      return
    }

    setCommunityPosts(posts =>
      posts.map(post =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: Date.now().toString(),
                  user: "Você",
                  avatar: userProfile?.name?.[0] || "V",
                  message: newCommentText,
                  time: "Agora"
                }
              ]
            }
          : post
      )
    )
    setNewCommentText("")
    setSelectedPost(null)
    alert("✅ Comentário adicionado!")
  }

  // Renderização do Splash Screen
  if (showSplash) {
    return (
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#A0D8E7] via-[#C3B1E1] to-[#B0EACD] transition-opacity duration-1000 ${
          splashFadeOut ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="text-center animate-fadeIn">
          <img 
            src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/cb3011f4-e48e-4c6d-b4ee-7e35611a1b6f.png" 
            alt="Serenar Logo" 
            className="w-48 h-48 mx-auto mb-6 rounded-full object-cover animate-pulse"
          />
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">Serenar</h1>
          <p className="text-xl text-white/90 drop-shadow-md">Cultive a paz interior</p>
        </div>
      </div>
    )
  }

  // Renderização do Onboarding
  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#A0D8E7]/20 via-white to-[#C3B1E1]/20 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#A0D8E7] to-[#C3B1E1] flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#3A5A98] mb-2">Bem-vindo ao Serenar</h2>
            <p className="text-gray-600">Vamos conhecer você melhor para personalizar sua experiência</p>
          </div>

          <div className="space-y-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-[#3A5A98] mb-2">
                Como você gostaria de ser chamado? *
              </label>
              <input
                type="text"
                value={onboardingData.name}
                onChange={(e) => setOnboardingData({ ...onboardingData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#A0D8E7] transition-colors"
                placeholder="Seu nome ou apelido"
              />
            </div>

            {/* Idade */}
            <div>
              <label className="block text-sm font-medium text-[#3A5A98] mb-2">
                Qual sua idade? *
              </label>
              <input
                type="number"
                value={onboardingData.age}
                onChange={(e) => setOnboardingData({ ...onboardingData, age: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#A0D8E7] transition-colors"
                placeholder="Ex: 25"
                min="1"
                max="120"
              />
            </div>

            {/* Frequência */}
            <div>
              <label className="block text-sm font-medium text-[#3A5A98] mb-2">
                Com que frequência você sente ansiedade? *
              </label>
              <select
                value={onboardingData.frequency}
                onChange={(e) => setOnboardingData({ ...onboardingData, frequency: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#A0D8E7] transition-colors"
              >
                <option value="">Selecione...</option>
                <option value="Diariamente">Diariamente</option>
                <option value="Algumas vezes por semana">Algumas vezes por semana</option>
                <option value="Raramente">Raramente</option>
                <option value="Não tenho certeza">Não tenho certeza</option>
              </select>
            </div>

            {/* Sintomas */}
            <div>
              <label className="block text-sm font-medium text-[#3A5A98] mb-2">
                Quais sintomas você costuma sentir? (opcional)
              </label>
              <div className="flex flex-wrap gap-2">
                {["Taquicardia", "Aperto no peito", "Pensamentos acelerados", "Sudorese", "Tremores", "Dificuldade para respirar"].map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => {
                      const updated = onboardingData.symptoms.includes(symptom)
                        ? onboardingData.symptoms.filter(s => s !== symptom)
                        : [...onboardingData.symptoms, symptom]
                      setOnboardingData({ ...onboardingData, symptoms: updated })
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      onboardingData.symptoms.includes(symptom)
                        ? 'bg-[#B0EACD] text-[#3A5A98] shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            {/* Acompanhamento */}
            <div>
              <label className="block text-sm font-medium text-[#3A5A98] mb-2">
                Você tem acompanhamento profissional? (opcional)
              </label>
              <select
                value={onboardingData.professional}
                onChange={(e) => setOnboardingData({ ...onboardingData, professional: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#A0D8E7] transition-colors"
              >
                <option value="">Selecione...</option>
                <option value="Sim, com psicólogo">Sim, com psicólogo</option>
                <option value="Sim, com psiquiatra">Sim, com psiquiatra</option>
                <option value="Sim, com ambos">Sim, com ambos</option>
                <option value="Não, mas gostaria">Não, mas gostaria</option>
                <option value="Não">Não</option>
              </select>
            </div>
          </div>

          <button
            onClick={saveOnboardingProfile}
            className="w-full mt-8 bg-gradient-to-r from-[#A0D8E7] to-[#C3B1E1] text-white py-4 rounded-full font-medium hover:shadow-lg transition-all"
          >
            Começar Minha Jornada
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            * Campos obrigatórios. Seus dados são privados e seguros.
          </p>
        </div>
      </div>
    )
  }

  // Renderização do Modal de Edição de Perfil
  if (showProfileEdit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#A0D8E7]/20 via-white to-[#C3B1E1]/20 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-12 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-[#3A5A98]">Editar Perfil</h2>
            <button
              onClick={() => setShowProfileEdit(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Foto de Perfil */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                {profileForm.photo ? (
                  <img 
                    src={profileForm.photo} 
                    alt="Foto de perfil" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#A0D8E7]"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#A0D8E7] to-[#C3B1E1] flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 p-2 bg-[#A0D8E7] rounded-full cursor-pointer hover:bg-[#C3B1E1] transition-colors shadow-lg">
                  <Camera className="w-5 h-5 text-white" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">Clique na câmera para adicionar foto</p>
            </div>

            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-[#3A5A98] mb-2">Nome</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#A0D8E7] transition-colors"
                placeholder="Seu nome"
              />
            </div>

            {/* Idade */}
            <div>
              <label className="block text-sm font-medium text-[#3A5A98] mb-2">Idade</label>
              <input
                type="number"
                value={profileForm.age}
                onChange={(e) => setProfileForm({ ...profileForm, age: parseInt(e.target.value) || 18 })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#A0D8E7] transition-colors"
                min="1"
                max="120"
              />
            </div>

            {/* Frequência */}
            <div>
              <label className="block text-sm font-medium text-[#3A5A98] mb-2">Frequência da ansiedade</label>
              <select
                value={profileForm.frequency}
                onChange={(e) => setProfileForm({ ...profileForm, frequency: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#A0D8E7] transition-colors"
              >
                <option value="">Selecione...</option>
                <option value="Diariamente">Diariamente</option>
                <option value="Algumas vezes por semana">Algumas vezes por semana</option>
                <option value="Raramente">Raramente</option>
                <option value="Não tenho certeza">Não tenho certeza</option>
              </select>
            </div>

            {/* Sintomas */}
            <div>
              <label className="block text-sm font-medium text-[#3A5A98] mb-2">Sintomas</label>
              <div className="flex flex-wrap gap-2">
                {["Taquicardia", "Aperto no peito", "Pensamentos acelerados", "Sudorese", "Tremores", "Dificuldade para respirar"].map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => {
                      const updated = profileForm.symptoms.includes(symptom)
                        ? profileForm.symptoms.filter(s => s !== symptom)
                        : [...profileForm.symptoms, symptom]
                      setProfileForm({ ...profileForm, symptoms: updated })
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      profileForm.symptoms.includes(symptom)
                        ? 'bg-[#B0EACD] text-[#3A5A98] shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            {/* Momentos */}
            <div>
              <label className="block text-sm font-medium text-[#3A5A98] mb-2">Momentos críticos</label>
              <div className="flex flex-wrap gap-2">
                {["Ao acordar", "Durante o trabalho", "À noite", "Em situações sociais", "Sem padrão definido"].map((moment) => (
                  <button
                    key={moment}
                    onClick={() => {
                      const updated = profileForm.moments.includes(moment)
                        ? profileForm.moments.filter(m => m !== moment)
                        : [...profileForm.moments, moment]
                      setProfileForm({ ...profileForm, moments: updated })
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      profileForm.moments.includes(moment)
                        ? 'bg-[#C3B1E1] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {moment}
                  </button>
                ))}
              </div>
            </div>

            {/* Acompanhamento */}
            <div>
              <label className="block text-sm font-medium text-[#3A5A98] mb-2">Acompanhamento profissional</label>
              <select
                value={profileForm.professional}
                onChange={(e) => setProfileForm({ ...profileForm, professional: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#A0D8E7] transition-colors"
              >
                <option value="">Selecione...</option>
                <option value="Sim, com psicólogo">Sim, com psicólogo</option>
                <option value="Sim, com psiquiatra">Sim, com psiquiatra</option>
                <option value="Sim, com ambos">Sim, com ambos</option>
                <option value="Não, mas gostaria">Não, mas gostaria</option>
                <option value="Não">Não</option>
              </select>
            </div>

            {/* Objetivos */}
            <div>
              <label className="block text-sm font-medium text-[#3A5A98] mb-2">Objetivos</label>
              <div className="flex flex-wrap gap-2">
                {["Dormir melhor", "Controlar crises", "Reduzir pensamentos acelerados", "Entender meus gatilhos", "Ter mais paz no dia a dia"].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => {
                      const updated = profileForm.goals.includes(goal)
                        ? profileForm.goals.filter(g => g !== goal)
                        : [...profileForm.goals, goal]
                      setProfileForm({ ...profileForm, goals: updated })
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      profileForm.goals.includes(goal)
                        ? 'bg-[#A0D8E7] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={saveProfile}
              className="flex-1 bg-gradient-to-r from-[#A0D8E7] to-[#C3B1E1] text-white py-4 rounded-full font-medium hover:shadow-lg transition-all"
            >
              Salvar Alterações
            </button>
            <button
              onClick={() => setShowProfileEdit(false)}
              className="px-8 py-4 bg-gray-100 text-gray-600 rounded-full font-medium hover:bg-gray-200 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Renderização da Área de Emergência
  if (showEmergency) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#A0D8E7] to-[#C3B1E1] flex items-center justify-center animate-pulse">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#3A5A98] mb-2">
              {emergencySteps[emergencyStep].message}
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              {emergencySteps[emergencyStep].action}
            </p>
            <p className="text-sm text-gray-500">
              {emergencySteps[emergencyStep].description}
            </p>
          </div>
          
          <div className="mb-8">
            <div 
              className={`w-64 h-64 mx-auto rounded-full flex items-center justify-center transition-all duration-1000 ${
                emergencyBreathing 
                  ? breathPhase === "inhale" 
                    ? 'bg-gradient-to-br from-[#A0D8E7] to-[#C3B1E1] scale-110' 
                    : 'bg-gradient-to-br from-[#B0EACD] to-[#A0D8E7] scale-90'
                  : 'bg-gradient-to-br from-[#A0D8E7] to-[#C3B1E1]'
              }`}
            >
              <div className="text-white text-center">
                <div className="text-6xl mb-4">
                  {emergencyBreathing ? (breathPhase === "inhale" ? "↑" : "↓") : "○"}
                </div>
                <div className="text-2xl font-medium">
                  {emergencyBreathing 
                    ? (breathPhase === "inhale" ? "Inspire" : "Expire")
                    : "Respire devagar"
                  }
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {!emergencyBreathing ? (
              <button
                onClick={startEmergencyBreathing}
                className="w-full bg-gradient-to-r from-[#A0D8E7] to-[#C3B1E1] text-white py-4 rounded-full font-medium hover:shadow-lg transition-all"
              >
                <Wind className="w-5 h-5 inline mr-2" />
                Começar Respiração Guiada
              </button>
            ) : (
              <button
                onClick={() => setEmergencyStep((emergencyStep + 1) % emergencySteps.length)}
                className="w-full bg-gradient-to-r from-[#A0D8E7] to-[#C3B1E1] text-white py-4 rounded-full font-medium hover:shadow-lg transition-all"
              >
                Próximo Passo
              </button>
            )}
            
            <button
              onClick={() => {
                setShowChat(true)
                setShowEmergency(false)
              }}
              className="w-full bg-white border-2 border-[#A0D8E7] text-[#3A5A98] py-4 rounded-full font-medium hover:shadow-lg transition-all"
            >
              <MessageCircle className="w-5 h-5 inline mr-2" />
              Conversar com Médico Amigo
            </button>
            
            <button
              onClick={() => setShowEmergency(false)}
              className="w-full bg-gray-100 text-gray-600 py-4 rounded-full font-medium hover:bg-gray-200 transition-all"
            >
              Estou Melhor Agora
            </button>
            
            <div className="pt-4 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-2">Se precisar de ajuda profissional imediata:</p>
              <a 
                href="tel:188" 
                className="inline-flex items-center gap-2 text-[#3A5A98] font-medium hover:underline"
              >
                <Phone className="w-4 h-4" />
                CVV: 188 (24h, gratuito)
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Modal de Chat do Médico Amigo (tela cheia)
  if (showChat) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#3A5A98] to-[#A0D8E7] flex flex-col">
        {/* Header do Chat */}
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Médico Amigo</h2>
                <p className="text-sm text-white/80">Sempre aqui para você</p>
              </div>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Perguntas Prontas (aparecem no início) */}
        {chatMessages.length === 1 && (
          <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 p-4">
            <div className="max-w-4xl mx-auto">
              <p className="text-white/90 text-sm mb-3 text-center">💙 Como posso te ajudar agora?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickQuestions.map((question) => (
                  <button
                    key={question.id}
                    onClick={() => handleQuickQuestion(question)}
                    className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl text-left transition-all border border-white/20 hover:border-white/40 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        {question.category === "anxiety" && "😰"}
                        {question.category === "racing-thoughts" && "🧠"}
                        {question.category === "fear" && "😨"}
                        {question.category === "depression" && "😔"}
                      </div>
                      <span className="text-white font-medium">{question.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Área de Mensagens */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-4 max-w-[85%] animate-fadeIn ${
                  msg.sender === "ai"
                    ? "bg-white/20 backdrop-blur-sm mr-auto"
                    : "bg-[#B0EACD] text-[#3A5A98] ml-auto"
                }`}
              >
                <p className={msg.sender === "ai" ? "text-white whitespace-pre-line" : "whitespace-pre-line"}>{msg.text}</p>
                <span className={`text-xs mt-2 block ${msg.sender === "ai" ? "text-white/70" : "opacity-70"}`}>
                  {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 max-w-[85%] mr-auto">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input de Mensagem */}
        <div className="bg-white/10 backdrop-blur-sm border-t border-white/20 p-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-6 py-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 focus:outline-none focus:border-white/50 placeholder-white/60 text-white"
            />
            <button
              onClick={sendChatMessage}
              className="px-8 py-4 bg-white text-[#3A5A98] rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Enviar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Modal de Exercício Ativo
  if (exerciseActive && selectedExercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#A0D8E7]/20 via-white to-[#C3B1E1]/20 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#3A5A98]">{selectedExercise.name}</h2>
              <span className="px-4 py-2 bg-[#B0EACD] text-[#3A5A98] rounded-full text-sm font-medium">
                {exerciseStep + 1} de {selectedExercise.steps?.length}
              </span>
            </div>
            
            <div className="flex gap-2 mb-8">
              {selectedExercise.steps?.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-2 flex-1 rounded-full transition-all ${
                    idx <= exerciseStep ? 'bg-[#A0D8E7]' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="mb-8 text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#A0D8E7] to-[#C3B1E1] flex items-center justify-center">
              <Wind className="w-16 h-16 text-white" />
            </div>
            <p className="text-2xl font-medium text-[#3A5A98] mb-4">
              {selectedExercise.steps?.[exerciseStep]}
            </p>
            <p className="text-gray-600">
              Siga as instruções com calma. Não há pressa.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={nextExerciseStep}
              className="w-full bg-gradient-to-r from-[#A0D8E7] to-[#C3B1E1] text-white py-4 rounded-full font-medium hover:shadow-lg transition-all"
            >
              {exerciseStep < (selectedExercise.steps?.length || 0) - 1 ? "Próximo Passo" : "Concluir Exercício"}
            </button>
            
            <button
              onClick={() => {
                setExerciseActive(false)
                setSelectedExercise(null)
              }}
              className="w-full bg-gray-100 text-gray-600 py-4 rounded-full font-medium hover:bg-gray-200 transition-all"
            >
              Sair do Exercício
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A0D8E7]/20 via-white to-[#C3B1E1]/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#A0D8E7]/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A0D8E7] to-[#C3B1E1] flex items-center justify-center overflow-hidden">
                <img 
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/cb3011f4-e48e-4c6d-b4ee-7e35611a1b6f.png" 
                  alt="Serenar Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#3A5A98]">Serenar</h1>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Botão de Perfil */}
              {userProfile && (
                <button
                  onClick={openProfileEdit}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#B0EACD]/20 hover:bg-[#B0EACD]/30 rounded-full transition-all"
                  title="Editar Perfil"
                >
                  {userProfile.photo ? (
                    <img 
                      src={userProfile.photo} 
                      alt="Perfil" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-[#3A5A98]" />
                  )}
                  <span className="text-sm font-medium text-[#3A5A98]">{userProfile.name}</span>
                </button>
              )}
              
              {/* Botão de Emergência */}
              <button
                onClick={() => setShowEmergency(true)}
                className="hidden sm:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-medium hover:shadow-lg transition-all animate-pulse"
              >
                <AlertCircle className="w-5 h-5" />
                SOS - Preciso de Ajuda
              </button>
              
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="sm:hidden p-2 rounded-lg hover:bg-[#A0D8E7]/20 transition-colors"
              >
                {menuOpen ? <X className="w-6 h-6 text-[#3A5A98]" /> : <Menu className="w-6 h-6 text-[#3A5A98]" />}
              </button>
            </div>
          </div>
          
          {/* Menu Mobile */}
          {menuOpen && (
            <div className="sm:hidden mt-4 space-y-2 pb-2">
              {userProfile && (
                <button
                  onClick={() => {
                    openProfileEdit()
                    setMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#B0EACD]/20 rounded-full font-medium text-[#3A5A98]"
                >
                  {userProfile.photo ? (
                    <img 
                      src={userProfile.photo} 
                      alt="Perfil" 
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                  {userProfile.name}
                </button>
              )}
              <button
                onClick={() => {
                  setShowEmergency(true)
                  setMenuOpen(false)
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-medium"
              >
                <AlertCircle className="w-5 h-5" />
                SOS - Preciso de Ajuda
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Navegação Rápida */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { view: "home", icon: Heart, label: "Início" },
            { view: "calendar", icon: Calendar, label: "Calendário" },
            { view: "exercises", icon: Wind, label: "Exercícios" },
            { view: "community", icon: Users, label: "Comunidade" },
            { view: "learning", icon: Play, label: "Aprender" }
          ].map(({ view, icon: Icon, label }) => (
            <button
              key={view}
              onClick={() => setCurrentView(view as any)}
              className={`p-4 rounded-2xl transition-all ${
                currentView === view 
                  ? 'bg-[#A0D8E7] text-white shadow-lg scale-105' 
                  : 'bg-white hover:shadow-md text-gray-700'
              }`}
            >
              <Icon className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {currentView === "home" && (
          <>
            {/* Welcome Section */}
            <section className="mb-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#3A5A98] mb-3">
                Como você está hoje, {userProfile?.name}?
              </h2>
              <p className="text-gray-600 text-lg">
                Vamos registrar juntos. Leva menos de 10 segundos.
              </p>
              {!canFillAnamnesis && (
                <div className="mt-4 p-4 bg-[#B0EACD]/20 rounded-2xl inline-block">
                  <p className="text-sm text-[#3A5A98] font-medium">
                    ✅ Você já preencheu a anamnese hoje! Volte amanhã para um novo registro.
                  </p>
                </div>
              )}
            </section>

            {/* Monitoramento Rápido */}
            <section className="mb-8 bg-white rounded-3xl shadow-lg p-6 sm:p-8 border border-[#A0D8E7]/30">
              <div className="space-y-6">
                {/* Humor */}
                <div>
                  <h3 className="text-lg font-bold text-[#3A5A98] mb-4">Seu humor agora</h3>
                  <div className="grid grid-cols-5 gap-2 sm:gap-3">
                    {moods.map((mood) => (
                      <button
                        key={mood.label}
                        onClick={() => {
                          if (canFillAnamnesis) {
                            setSelectedMood(mood.label)
                            setAnxietyLevel(mood.value)
                          }
                        }}
                        disabled={!canFillAnamnesis}
                        className={`p-3 rounded-2xl transition-all ${
                          selectedMood === mood.label ? `${mood.color} shadow-lg scale-105` : 'bg-gray-50 hover:bg-gray-100'
                        } ${!canFillAnamnesis ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="text-3xl mb-1">{mood.emoji}</div>
                        <div className="text-xs font-medium">{mood.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nível de Ansiedade */}
                <div>
                  <div className="flex justify-between mb-2">
                    <h3 className="text-lg font-bold text-[#3A5A98]">Ansiedade (1-10)</h3>
                    <span className="text-2xl font-bold text-[#3A5A98]">{anxietyLevel}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={anxietyLevel}
                    onChange={(e) => canFillAnamnesis && setAnxietyLevel(Number(e.target.value))}
                    disabled={!canFillAnamnesis}
                    className="w-full h-3 bg-gradient-to-r from-[#B0EACD] via-[#A0D8E7] to-[#3A5A98] rounded-full appearance-none cursor-pointer disabled:opacity-50"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Tranquilo</span>
                    <span>Muito ansioso</span>
                  </div>
                </div>

                {/* Gatilhos */}
                <div>
                  <h3 className="text-lg font-bold text-[#3A5A98] mb-3">O que pode ter causado?</h3>
                  <div className="flex flex-wrap gap-2">
                    {triggers.map((trigger) => (
                      <button
                        key={trigger}
                        onClick={() => {
                          if (canFillAnamnesis) {
                            setSelectedTriggers(prev =>
                              prev.includes(trigger) ? prev.filter(t => t !== trigger) : [...prev, trigger]
                            )
                          }
                        }}
                        disabled={!canFillAnamnesis}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedTriggers.includes(trigger)
                            ? 'bg-[#C3B1E1] text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${!canFillAnamnesis ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {trigger}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sintomas */}
                <div>
                  <h3 className="text-lg font-bold text-[#3A5A98] mb-3">Sintomas físicos</h3>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map((symptom) => (
                      <button
                        key={symptom}
                        onClick={() => {
                          if (canFillAnamnesis) {
                            setSelectedSymptoms(prev =>
                              prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
                            )
                          }
                        }}
                        disabled={!canFillAnamnesis}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedSymptoms.includes(symptom)
                            ? 'bg-[#B0EACD] text-[#3A5A98] shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${!canFillAnamnesis ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <h3 className="text-lg font-bold text-[#3A5A98] mb-3">Observações (opcional)</h3>
                  <textarea
                    value={quickNotes}
                    onChange={(e) => canFillAnamnesis && setQuickNotes(e.target.value)}
                    disabled={!canFillAnamnesis}
                    placeholder="Algo mais que queira registrar..."
                    className="w-full h-20 p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#A0D8E7] transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <button
                  onClick={saveMoodEntry}
                  disabled={!selectedMood || !canFillAnamnesis}
                  className="w-full bg-gradient-to-r from-[#A0D8E7] to-[#C3B1E1] text-white py-4 rounded-full font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {canFillAnamnesis ? "Salvar Registro" : "Já preenchido hoje"}
                </button>
              </div>
            </section>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Diário com IA */}
              <section className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 border border-[#C3B1E1]/30">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-6 h-6 text-[#3A5A98]" />
                  <h3 className="text-2xl font-bold text-[#3A5A98]">Diário Emocional</h3>
                </div>
                <p className="text-gray-600 mb-4">Escreva livremente. A IA vai ajudar você a entender padrões.</p>
                <textarea
                  value={diaryEntry}
                  onChange={(e) => setDiaryEntry(e.target.value)}
                  placeholder="Como foi seu dia? O que você sentiu? O que te preocupa?"
                  className="w-full h-40 p-4 border-2 border-[#C3B1E1]/30 rounded-2xl focus:outline-none focus:border-[#C3B1E1] transition-colors resize-none"
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={analyzeDiary}
                    className="flex-1 bg-gradient-to-r from-[#C3B1E1] to-[#A0D8E7] text-white py-3 rounded-full font-medium hover:shadow-lg transition-all"
                  >
                    <Brain className="w-5 h-5 inline mr-2" />
                    Analisar com IA
                  </button>
                  <button
                    onClick={exportDiaryPDF}
                    className="px-6 py-3 bg-gray-100 text-[#3A5A98] rounded-full font-medium hover:shadow-md transition-all"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
                
                {showDiaryAnalysis && diaryInsights.length > 0 && (
                  <div className="mt-6 p-4 bg-[#C3B1E1]/10 rounded-2xl space-y-3">
                    <h4 className="font-bold text-[#3A5A98] mb-2">Insights da IA:</h4>
                    {diaryInsights.map((insight, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Sparkles className="w-5 h-5 text-[#C3B1E1] flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">{insight}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Progresso e Conquistas */}
              <section className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 border border-[#B0EACD]/30">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6 text-[#3A5A98]" />
                  <h3 className="text-2xl font-bold text-[#3A5A98]">Sua Jornada</h3>
                </div>
                
                <div className="mb-6 p-4 bg-gradient-to-r from-[#B0EACD]/20 to-[#A0D8E7]/20 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Sequência atual</span>
                    <span className="text-3xl font-bold text-[#3A5A98]">{streak} dias</span>
                  </div>
                  <div className="text-sm text-gray-600">Continue assim! Você está indo muito bem.</div>
                </div>

                <div className="space-y-3 mb-6">
                  {achievements.map((achievement, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl flex items-center gap-3 transition-all ${
                        achievement.unlocked ? 'bg-[#B0EACD]/20' : 'bg-gray-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                        achievement.unlocked ? 'bg-[#B0EACD]' : 'bg-gray-200'
                      }`}>
                        {achievement.icon}
                      </div>
                      <span className={`font-medium ${achievement.unlocked ? 'text-[#3A5A98]' : 'text-gray-400'}`}>
                        {achievement.name}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="text-center">
                      <div className={`w-full h-12 rounded-lg mb-1 transition-all ${
                        i < 5 ? 'bg-[#B0EACD]' : 'bg-gray-100'
                      }`}></div>
                      <span className="text-xs text-gray-500">
                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Plano Semanal Personalizado */}
            <section className="mb-8 bg-white rounded-3xl shadow-lg p-6 sm:p-8 border border-[#A0D8E7]/30">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-[#3A5A98]" />
                <h3 className="text-2xl font-bold text-[#3A5A98]">Seu Plano Semanal</h3>
              </div>
              <p className="text-gray-600 mb-6">Atividades personalizadas baseadas no seu perfil</p>
              
              <div className="space-y-4">
                {weeklyPlan.map((item, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-r from-[#A0D8E7]/10 to-[#C3B1E1]/10 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="font-medium text-[#3A5A98]">{item.activity}</span>
                      </div>
                      <span className="text-sm text-gray-600">{item.completed}/{item.target}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#A0D8E7] to-[#C3B1E1] h-2 rounded-full transition-all"
                        style={{ width: `${(item.completed / item.target) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Médico Amigo - Card de Acesso */}
            <section className="mb-8 bg-gradient-to-br from-[#3A5A98] to-[#A0D8E7] rounded-3xl shadow-xl p-6 sm:p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-6 h-6" />
                <h3 className="text-2xl font-bold">Médico Amigo</h3>
              </div>
              <p className="mb-6 opacity-90">
                Converse comigo sobre o que você está sentindo. Vou ajudar você a entender e encontrar o melhor caminho.
              </p>
              <button
                onClick={() => setShowChat(true)}
                className="w-full bg-white border-2 border-[#A0D8E7] text-[#3A5A98] py-4 rounded-full font-medium hover:shadow-lg transition-all"
              >
                Conversar com Médico Amigo
              </button>
            </section>
          </>
        )}

        {currentView === "exercises" && (
          <section className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
            <h2 className="text-3xl font-bold text-[#3A5A98] mb-6">Exercícios Guiados</h2>
            <p className="text-gray-600 mb-8">Escolha um exercício e marque se funcionou para você. Assim, vamos aprender juntos.</p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="p-5 bg-gradient-to-br from-[#A0D8E7]/10 to-[#C3B1E1]/10 rounded-2xl hover:shadow-lg transition-all border border-[#A0D8E7]/30"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-[#3A5A98]">{exercise.name}</h4>
                    <span className="text-xs bg-[#B0EACD] text-[#3A5A98] px-2 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {exercise.duration}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{exercise.description}</p>
                  <button 
                    onClick={() => startExercise(exercise)}
                    className="w-full bg-gradient-to-r from-[#A0D8E7] to-[#C3B1E1] text-white py-2 rounded-full text-sm font-medium hover:shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Iniciar
                  </button>
                  
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => markExerciseWorked(exercise.id, true)}
                      className="flex-1 text-xs py-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-all"
                    >
                      👍 Funcionou
                    </button>
                    <button
                      onClick={() => markExerciseWorked(exercise.id, false)}
                      className="flex-1 text-xs py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                    >
                      👎 Não ajudou
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {currentView === "calendar" && (
          <section className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
            <h2 className="text-3xl font-bold text-[#3A5A98] mb-6">Calendário Emocional</h2>
            <p className="text-gray-600 mb-8">Veja seus padrões ao longo do tempo. Conhecimento é poder.</p>
            
            <div className="mb-6">
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {[...Array(35)].map((_, i) => {
                  const intensity = Math.random()
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer transition-all hover:scale-110 ${
                        intensity > 0.7 ? 'bg-[#3A5A98] text-white' :
                        intensity > 0.4 ? 'bg-[#A0D8E7] text-white' :
                        intensity > 0.2 ? 'bg-[#B0EACD]' :
                        'bg-gray-100'
                      }`}
                      title={`Ansiedade: ${Math.floor(intensity * 10)}/10`}
                    >
                      {i + 1}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="p-6 bg-[#A0D8E7]/10 rounded-2xl mb-6">
              <h3 className="font-bold text-[#3A5A98] mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Padrões Identificados
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#A0D8E7] rounded-full mt-1.5" />
                  <span>Você tem mais crises de ansiedade no período da noite (após 20h)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#A0D8E7] rounded-full mt-1.5" />
                  <span>Segundas e terças-feiras são dias mais sensíveis</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#B0EACD] rounded-full mt-1.5" />
                  <span>Sua ansiedade diminuiu 23% nas últimas 2 semanas - parabéns!</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#C3B1E1] rounded-full mt-1.5" />
                  <span>Exercícios de respiração têm ajudado nos momentos críticos</span>
                </li>
              </ul>
            </div>

            {moodEntries.length > 0 && (
              <div className="p-6 bg-white border border-[#C3B1E1]/30 rounded-2xl">
                <h3 className="font-bold text-[#3A5A98] mb-4">Últimos Registros</h3>
                <div className="space-y-3">
                  {moodEntries.slice(-5).reverse().map((entry, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {moods.find(m => m.label === entry.mood)?.emoji}
                        </div>
                        <div>
                          <div className="font-medium text-[#3A5A98]">{entry.mood}</div>
                          <div className="text-xs text-gray-500">{entry.time}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-700">Ansiedade: {entry.anxiety}/10</div>
                        {entry.triggers.length > 0 && (
                          <div className="text-xs text-gray-500">{entry.triggers[0]}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {currentView === "community" && (
          <section className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
            <h2 className="text-3xl font-bold text-[#3A5A98] mb-6">Comunidade Serenar</h2>
            <p className="text-gray-600 mb-8">Um espaço seguro para compartilhar, apoiar e crescer juntos. Todos os posts são anônimos e moderados 24h.</p>
            
            {/* Criar novo post */}
            <div className="mb-8 p-6 bg-gradient-to-br from-[#A0D8E7]/10 to-[#C3B1E1]/10 rounded-2xl border-2 border-dashed border-[#A0D8E7]/30">
              <h3 className="font-bold text-[#3A5A98] mb-3">Compartilhe sua história</h3>
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="Como você está se sentindo? Compartilhe uma conquista, um desafio ou uma palavra de apoio..."
                className="w-full h-24 p-4 border-2 border-[#A0D8E7]/30 rounded-2xl focus:outline-none focus:border-[#A0D8E7] transition-colors resize-none mb-3"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {userProfile?.frequency && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#B0EACD]/20 rounded-full mr-2">
                      <span className="w-2 h-2 bg-[#B0EACD] rounded-full" />
                      Perfil: {userProfile.frequency}
                    </span>
                  )}
                  Seu post será anônimo e seguro
                </p>
                <button
                  onClick={createPost}
                  className="px-6 py-2 bg-gradient-to-r from-[#A0D8E7] to-[#C3B1E1] text-white rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Compartilhar
                </button>
              </div>
            </div>

            {/* Lista de posts */}
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <div key={post.id} className="p-5 bg-gradient-to-br from-[#A0D8E7]/10 to-[#C3B1E1]/10 rounded-2xl hover:shadow-md transition-all border border-[#A0D8E7]/20">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#A0D8E7] flex items-center justify-center text-white font-bold flex-shrink-0">
                      {post.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-[#3A5A98]">{post.user}</div>
                          {post.userProfile?.frequency && (
                            <span className="text-xs px-2 py-0.5 bg-[#B0EACD]/20 text-[#3A5A98] rounded-full">
                              {post.userProfile.frequency}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{post.time}</span>
                      </div>
                      <p className="text-gray-700 mb-3">{post.message}</p>
                      {post.userProfile?.goals && post.userProfile.goals.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {post.userProfile.goals.slice(0, 2).map((goal, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-[#C3B1E1]/20 text-[#3A5A98] rounded-full">
                              🎯 {goal}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 ml-13 mb-3">
                    <button 
                      onClick={() => likePost(post.id)}
                      className="flex items-center gap-1 hover:text-[#3A5A98] transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      {post.likes}
                    </button>
                    <button 
                      onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                      className="hover:text-[#3A5A98] transition-colors"
                    >
                      Responder ({post.comments.length})
                    </button>
                    <button className="hover:text-[#3A5A98] transition-colors flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      Apoiar
                    </button>
                  </div>

                  {/* Comentários */}
                  {post.comments.length > 0 && (
                    <div className="ml-13 space-y-2 mb-3 pl-4 border-l-2 border-[#A0D8E7]/30">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="p-3 bg-white/50 rounded-xl">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#C3B1E1] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {comment.avatar}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-[#3A5A98]">{comment.user}</span>
                                <span className="text-xs text-gray-500">{comment.time}</span>
                              </div>
                              <p className="text-sm text-gray-700">{comment.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Adicionar comentário */}
                  {selectedPost === post.id && (
                    <div className="ml-13 mt-3 flex gap-2">
                      <input
                        type="text"
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Escreva uma palavra de apoio..."
                        className="flex-1 px-4 py-2 border-2 border-[#A0D8E7]/30 rounded-full focus:outline-none focus:border-[#A0D8E7] transition-colors text-sm"
                        onKeyPress={(e) => e.key === 'Enter' && addComment(post.id)}
                      />
                      <button
                        onClick={() => addComment(post.id)}
                        className="px-4 py-2 bg-[#A0D8E7] text-white rounded-full text-sm font-medium hover:shadow-md transition-all"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-[#B0EACD]/10 rounded-2xl text-center">
              <p className="text-sm text-gray-600">
                💚 Esta comunidade é moderada 24h para garantir um espaço seguro e acolhedor para todos.
              </p>
            </div>
          </section>
        )}

        {currentView === "learning" && (
          <section className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
            <h2 className="text-3xl font-bold text-[#3A5A98] mb-6">Conteúdos Profissionais</h2>
            <p className="text-gray-600 mb-8">Aprenda com especialistas sobre ansiedade, técnicas e bem-estar.</p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Entendendo a Ansiedade", duration: "8 min", type: "Vídeo", category: "Fundamentos" },
                { title: "Técnicas de Respiração", duration: "12 min", type: "Curso", category: "Prática" },
                { title: "Higiene do Sono", duration: "6 min", type: "Vídeo", category: "Bem-estar" },
                { title: "Mindfulness no Dia a Dia", duration: "15 min", type: "Curso", category: "Meditação" },
                { title: "Gatilhos Emocionais", duration: "10 min", type: "Vídeo", category: "Autoconhecimento" },
                { title: "Autocuidado Prático", duration: "20 min", type: "Curso", category: "Rotina" }
              ].map((content, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-[#A0D8E7] to-[#C3B1E1] rounded-2xl mb-3 flex items-center justify-center group-hover:shadow-lg transition-all relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
                    <Play className="w-12 h-12 text-white relative z-10 group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="font-bold text-[#3A5A98] mb-2">{content.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-[#B0EACD]/20 rounded-full text-xs font-medium">{content.type}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {content.duration}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{content.category}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-[#A0D8E7]/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-[#A0D8E7]" />
            <p className="text-gray-600 font-medium">
              Serenar - Sua ferramenta de autocuidado no bolso
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Feito com carinho para quem busca leveza, clareza e paz 💙
          </p>
        </div>
      </footer>
    </div>
  )
}
