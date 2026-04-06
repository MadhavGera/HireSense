"use client";

import { BookOpen, ExternalLink, AlertTriangle, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { skillGapData, dashboardData } from "@/data/mockData";
import {
  StaggerContainer,
  FadeInUp,
  ScaleIn,
} from "@/components/motion/MotionPrimitives";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';

const priorityColors = {
  high: "bg-error/10 text-error border-error/20",
  medium: "bg-tertiary/10 text-tertiary border-tertiary/20",
};

export default function SkillGapPage() {
  const chartData = skillGapData.required.map(s => ({
    name: s.skill,
    current: s.current,
    required: s.required,
    gap: s.gap
  }));

  const renderCustomLegend = () => (
    <div className="flex items-center justify-center gap-8 pt-4">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-error" />
        <span className="text-xs font-semibold text-on-surface-variant">Current</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
        <span className="text-xs font-semibold text-on-surface-variant">Required</span>
      </div>
    </div>
  );

  return (
    <StaggerContainer delayStart={0.05} staggerInterval={0.08}>
      {/* Header */}
      <FadeInUp>
        <div className="mb-10">
          <h1 className="text-3xl font-black font-headline text-on-surface tracking-tight">
            Skill Gap Analysis
          </h1>
          <p className="text-on-surface-variant mt-2 text-lg">
            Comparing {dashboardData.fullName}&apos;s skills against the{" "}
            <span className="text-primary font-semibold">{dashboardData.role}</span> requirements.
          </p>
        </div>
      </FadeInUp>

      {/* Skill Bars */}
      <FadeInUp>
        <div className="bg-surface-container-low rounded-2xl p-8 mb-8 border border-outline-variant/10">
          <div className="mb-8">
            <h2 className="text-lg font-bold font-headline text-on-surface mb-1">
              Skills vs. Requirements
            </h2>
            <p className="text-on-surface-variant text-xs">
              Interactive comparison of your current proficiency vs. role expectations.
            </p>
          </div>
          
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
                barGap={4}
                barSize={8}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                  ticks={[0, 25, 50, 75, 100]}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 11 }} 
                  axisLine={false} 
                  tickLine={false} 
                  width={150} 
                />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#192540', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#dee5ff' }} 
                />
                <Legend content={renderCustomLegend} verticalAlign="bottom" />
                <Bar dataKey="current" name="Current" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.gap > 0 ? "#ff716c" : "#69f6b8"} />
                  ))}
                </Bar>
                <Bar dataKey="required" name="Required" fill="#40485d" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-8">
            {skillGapData.required.filter(s => s.gap > 0).map((skill) => (
              <div key={skill.skill} className="flex items-center gap-3 p-3 rounded-lg bg-error/5 border border-error/10">
                <AlertTriangle className="w-4 h-4 text-error" />
                <span className="text-xs text-error/90 font-medium">
                  <span className="font-bold">{skill.skill}</span>: {skill.gap}% gap — improvement needed
                </span>
              </div>
            ))}
          </div>
        </div>
      </FadeInUp>

      {/* Recommended Resources */}
      <FadeInUp>
        <div className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant/10">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold font-headline text-on-surface">
              Recommended Learning Resources
            </h2>
          </div>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4" delayStart={0} staggerInterval={0.06}>
            {skillGapData.recommendations.map((rec) => (
              <ScaleIn key={rec.title}>
                <div className="bg-surface-container-high rounded-xl p-5 border border-outline-variant/10 hover-lift group cursor-pointer h-full flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityColors[rec.priority as keyof typeof priorityColors]}`}>
                      {rec.priority} priority
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-sm font-bold text-on-surface mb-1">
                    {rec.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant flex-1">
                    {rec.provider} · {rec.duration}
                  </p>
                  <Button variant="ghost" size="sm" className="mt-3 gap-1 px-0 self-start">
                    <ExternalLink className="w-3 h-3" />
                    Start Learning
                  </Button>
                </div>
              </ScaleIn>
            ))}
          </StaggerContainer>
        </div>
      </FadeInUp>
    </StaggerContainer>
  );
}
