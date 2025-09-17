<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Field extends Model
{
    use HasFactory;

    protected $fillable = ['form_id','type','label','required','order'];
    protected $casts = ['required' => 'boolean'];
    public function options(){ return $this->hasMany(FieldOption::class)->orderBy('order'); }
    public function form(){ return $this->belongsTo(Form::class); }
}
