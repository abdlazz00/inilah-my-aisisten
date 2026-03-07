<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    use HasUuids;
    //
    protected $fillable = ['name', 'system_prompt', 'is_active', 'user_id'];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function contacts()
    {
        return $this->hasMany(Contact::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
