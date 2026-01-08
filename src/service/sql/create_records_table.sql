-- ============================================
-- 收支记录表 (records) 创建脚本
-- ============================================

-- 1. 创建 records 表
CREATE TABLE IF NOT EXISTS public.records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- ON DELETE CASCADE 级联删除规则。如果 auth.users 表中某个用户被删除了，那么 records 表中所有属于该用户的收支记录会自动被删除
    type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
    amount NUMERIC NOT NULL, -- NUMERIC 高精度数值类型，专门用于存储金额、财务数据等需要精确计算的数值
    category TEXT NOT NULL,
    note TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL, -- TIME ZONE 关联时区信息
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- DEFAULT NOW()：给字段设置默认值，插入记录时不指定 created_at/updated_at，会自动填充
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建索引以优化查询性能
CREATE INDEX IF NOT EXISTS idx_records_user_id ON public.records(user_id);
CREATE INDEX IF NOT EXISTS idx_records_user_date ON public.records(user_id, date DESC); -- DESC 降序排序，适合从新到旧的数据;ASC 升序排序，适合从旧到新的数据
CREATE INDEX IF NOT EXISTS idx_records_type ON public.records(type);

-- 3. 创建自动更新 updated_at 的触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_records_updated_at
    BEFORE UPDATE ON public.records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. 启用行级安全 (RLS)
ALTER TABLE public.records ENABLE ROW LEVEL SECURITY;

-- 5. 创建 RLS 策略
-- 用户可以查看自己的记录
CREATE POLICY "Users can view own records"
    ON public.records FOR SELECT
    USING (auth.uid() = user_id);

-- 用户可以插入自己的记录
CREATE POLICY "Users can insert own records"
    ON public.records FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 用户可以更新自己的记录
CREATE POLICY "Users can update own records"
    ON public.records FOR UPDATE
    USING (auth.uid() = user_id);

-- 用户可以删除自己的记录
CREATE POLICY "Users can delete own records"
    ON public.records FOR DELETE
    USING (auth.uid() = user_id);

-- 6. 添加注释
COMMENT ON TABLE public.records IS '收支记录表';
COMMENT ON COLUMN public.records.id IS '记录唯一标识';
COMMENT ON COLUMN public.records.user_id IS '关联用户ID';
COMMENT ON COLUMN public.records.type IS '记录类型: expense(支出) 或 income(收入)';
COMMENT ON COLUMN public.records.amount IS '金额(支出为负,收入为正)';
COMMENT ON COLUMN public.records.category IS '分类: 餐饮/交通/购物等';
COMMENT ON COLUMN public.records.note IS '备注信息';
COMMENT ON COLUMN public.records.date IS '交易日期';
COMMENT ON COLUMN public.records.image_url IS '收据/凭证图片URL';
COMMENT ON COLUMN public.records.created_at IS '记录创建时间';
COMMENT ON COLUMN public.records.updated_at IS '记录最后更新时间';
